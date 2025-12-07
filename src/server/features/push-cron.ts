import { CRON_SECRET } from "astro:env/server"
import { isDeleted } from "#shared/schema/user"
import { toZonedTime, format, fromZonedTime } from "date-fns-tz"
import { Hono } from "hono"
import { bearerAuth } from "hono/bearer-auth"
import {
	getEnabledDevices,
	sendNotificationToDevice,
	markNotificationSettingsAsDelivered,
	peopleQuery,
	getIntl,
} from "./push-shared"
import type {
	PushDevice,
	NotificationPayload,
	LoadedNotificationSettings,
	LoadedUserAccountWithPeople,
	LoadedUserAccountSettings,
} from "./push-shared"

export { cronDeliveryApp }

// NOTE: Notification delivery is currently disabled pending Jazz-based user enumeration.
// The cron endpoint exists but does not process any users until a Jazz-compatible
// user iteration API is implemented. See task 9 in the domain-driven reorganization spec.

let cronDeliveryApp = new Hono().get(
	"/deliver-notifications",
	bearerAuth({ token: CRON_SECRET || "static-build-placeholder" }),
	async c => {
		console.log("🔔 Starting notification delivery cron job")
		let deliveryResults: Array<{
			userID: string
			notificationCount: number
			success: boolean
		}> = []

		// Notification delivery is disabled until Jazz-based user enumeration is available.
		// When ready, iterate over users here and call the processing pipeline.

		return c.json({
			message: `Processed ${deliveryResults.length} notification deliveries`,
			results: deliveryResults,
		})
	},
)

function isPastNotificationTime(
	notificationSettings: LoadedNotificationSettings,
	currentUtc: Date,
): boolean {
	let userTimezone = notificationSettings.timezone || "UTC"
	let userNotificationTime = notificationSettings.notificationTime || "12:00"

	let userLocalTime = toZonedTime(currentUtc, userTimezone)
	let userLocalTimeStr = format(userLocalTime, "HH:mm")

	return userLocalTimeStr >= userNotificationTime
}

function wasDeliveredToday(
	notifications: LoadedNotificationSettings,
	currentUtc: Date,
): boolean {
	if (!notifications.lastDeliveredAt) return false

	let userTimezone = notifications.timezone || "UTC"
	let userNotificationTime = notifications.notificationTime || "12:00"
	let userLocalTime = toZonedTime(currentUtc, userTimezone)
	let userLocalDate = format(userLocalTime, "yyyy-MM-dd")

	let lastDeliveredUserTime = toZonedTime(
		notifications.lastDeliveredAt,
		userTimezone,
	)
	let lastDeliveredDate = format(lastDeliveredUserTime, "yyyy-MM-dd")

	if (lastDeliveredDate !== userLocalDate) return false

	let todayNotificationDateTime = new Date(
		`${userLocalDate}T${userNotificationTime}:00`,
	)
	let todayNotificationUtc = fromZonedTime(
		todayNotificationDateTime,
		userTimezone,
	)

	return notifications.lastDeliveredAt >= todayNotificationUtc
}

function getDueReminderCount(
	userAccount: LoadedUserAccountWithPeople,
	notificationSettings: LoadedNotificationSettings,
	currentUtc: Date,
): number {
	let userTimezone = notificationSettings.timezone || "UTC"
	let userLocalTime = toZonedTime(currentUtc, userTimezone)
	let userLocalDateStr = format(userLocalTime, "yyyy-MM-dd")

	let people = userAccount?.root?.people ?? []
	if (!people.$isLoaded) return 0
	let dueReminderCount = 0
	for (let person of Array.from(people)) {
		if (!person?.$isLoaded || !person.reminders?.$isLoaded || isDeleted(person))
			continue
		for (let reminder of Array.from(person.reminders)) {
			if (!reminder?.$isLoaded || reminder.done || isDeleted(reminder)) continue
			let dueDate = new Date(reminder.dueAtDate)
			let dueDateInUserTimezone = toZonedTime(dueDate, userTimezone)
			let dueDateStr = format(dueDateInUserTimezone, "yyyy-MM-dd")
			if (dueDateStr <= userLocalDateStr) {
				dueReminderCount++
			}
		}
	}
	return dueReminderCount
}

function createLocalizedNotificationPayload(
	reminderCount: number,
	userId: string,
	worker: LoadedUserAccountSettings,
): NotificationPayload {
	let t = getIntl(worker)
	return {
		title: t("server.push.dueReminders.title", { count: reminderCount }),
		body: t("server.push.dueReminders.body"),
		icon: "/favicon.ico",
		badge: "/favicon.ico",
		url: "/app/reminders",
		userId,
		count: reminderCount,
	}
}

// The following functions are preserved for when Jazz-based user enumeration is implemented.
// They form the notification processing pipeline.

async function shouldReceiveNotification<
	T extends {
		notificationSettings: LoadedNotificationSettings
		currentUtc: Date
		user: { id: string }
	},
>(data: T) {
	let { notificationSettings, currentUtc, user } = data

	if (!isPastNotificationTime(notificationSettings, currentUtc)) {
		let userTimezone = notificationSettings.timezone || "UTC"
		let userNotificationTime = notificationSettings.notificationTime || "12:00"
		let userLocalTime = toZonedTime(currentUtc, userTimezone)
		let userLocalTimeStr = format(userLocalTime, "HH:mm")
		throw `Not past notification time (current: ${userLocalTimeStr}, configured: ${userNotificationTime}, timezone: ${userTimezone})`
	}

	if (wasDeliveredToday(notificationSettings, currentUtc)) {
		let userTimezone = notificationSettings.timezone || "UTC"
		let lastDelivered = notificationSettings.lastDeliveredAt
			? format(
				toZonedTime(notificationSettings.lastDeliveredAt, userTimezone),
				"yyyy-MM-dd HH:mm",
			)
			: "never"
		throw `Already delivered today (last delivered: ${lastDelivered})`
	}

	console.log(`✅ User ${user.id}: Passed notification time checks`)

	return data
}

type NotificationProcessingContext = {
	user: { id: string }
	notificationSettings: LoadedNotificationSettings
	worker: LoadedUserAccountSettings
	currentUtc: Date
}

type DueNotificationContext = NotificationProcessingContext & {
	dueReminderCount: number
}

type DeviceNotificationContext = DueNotificationContext & {
	devices: PushDevice[]
}

async function hasDueNotifications(
	data: NotificationProcessingContext,
): Promise<DueNotificationContext> {
	let { user, notificationSettings, worker, currentUtc } = data

	let userAccountWithPeople = await worker.$jazz.ensureLoaded({
		resolve: peopleQuery,
	})

	let dueReminderCount = getDueReminderCount(
		userAccountWithPeople,
		notificationSettings,
		currentUtc,
	)

	console.log(
		`✅ User ${user.id}: Checked due reminders (${dueReminderCount} found)`,
	)

	return {
		user,
		notificationSettings,
		worker,
		currentUtc,
		dueReminderCount,
	}
}

async function getDevices(
	data: DueNotificationContext,
): Promise<DeviceNotificationContext> {
	let { user, notificationSettings } = data

	if (data.dueReminderCount === 0) {
		console.log(`✅ User ${user.id}: No due reminders to notify about`)
		return {
			...data,
			devices: [],
		}
	}

	let enabledDevices = getEnabledDevices(notificationSettings)
	if (enabledDevices.length === 0) {
		console.log(`✅ User ${user.id}: No enabled devices`)
		return {
			...data,
			devices: [],
		}
	}

	console.log(
		`✅ User ${data.user.id}: Ready to send notification for ${data.dueReminderCount} due reminders to ${enabledDevices.length} devices`,
	)

	return {
		...data,
		devices: enabledDevices,
	}
}

async function processDevicesPipeline(
	userWithDevices: DeviceNotificationContext,
) {
	let {
		user,
		devices,
		dueReminderCount,
		notificationSettings,
		worker,
		currentUtc,
	} = userWithDevices

	if (devices.length === 0) {
		markNotificationSettingsAsDelivered(notificationSettings, currentUtc)
		await worker.$jazz.waitForSync()
		console.log(
			`✅ User ${user.id}: Marked as delivered (skipped - no action needed)`,
		)
		return [
			{
				userID: user.id,
				notificationCount: 0,
				success: true,
			},
		]
	}

	let payload = createLocalizedNotificationPayload(
		dueReminderCount,
		user.id,
		worker,
	)

	let devicePromises = devices.map((device: PushDevice) =>
		sendNotificationToDevice(device, payload),
	)

	let results = await Promise.allSettled(devicePromises)

	let deviceResults = results.map((result, i) => {
		let success = result.status === "fulfilled" && result.value?.ok === true

		if (!success) {
			let error =
				result.status === "fulfilled"
					? !result.value.ok
						? result.value.error
						: "Device delivery failed"
					: result.reason?.message || result.reason || "Unknown error"

			console.error(
				`❌ User ${user.id}: Failed to send to device ${devices[i].endpoint.slice(-10)}:`,
				error,
			)
		} else {
			console.log(
				`✅ User ${user.id}: Successfully sent to device ${devices[i].endpoint.slice(-10)}`,
			)
		}

		return { success }
	})

	let userSuccess = deviceResults.some(r => r.success)

	markNotificationSettingsAsDelivered(notificationSettings, currentUtc)
	await worker.$jazz.waitForSync()

	console.log(`✅ User ${user.id}: Completed notification delivery`)

	return [
		{
			userID: user.id,
			notificationCount: dueReminderCount,
			success: userSuccess,
		},
	]
}

// Export pipeline functions to suppress unused warnings - these will be used
// when Jazz-based user enumeration is implemented
export const _pipelineFunctions = {
	shouldReceiveNotification,
	hasDueNotifications,
	getDevices,
	processDevicesPipeline,
} as const
