import { CRON_SECRET } from "astro:env/server"
// TODO: Replace with Jazz-based user enumeration in task 9
// import { type User, getUsersWithJazz } from "#shared/clerk/server"
import { isDeleted } from "#shared/schema/user"

// Temporary type stub - will be removed in task 9
type User = { id: string; unsafeMetadata?: Record<string, unknown> }
// Disabled for Clerk to Passkey migration
// import { initUserWorker } from "../lib/utils"
// import { tryCatch } from "#shared/lib/trycatch"
import { toZonedTime, format, fromZonedTime } from "date-fns-tz"
import { Hono } from "hono"
import { bearerAuth } from "hono/bearer-auth"
import {
	getEnabledDevices,
	sendNotificationToDevice,
	markNotificationSettingsAsDelivered,
	// settingsQuery, // Disabled for Clerk to Passkey migration
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

let cronDeliveryApp = new Hono().get(
	"/deliver-notifications",
	bearerAuth({ token: CRON_SECRET }),
	async c => {
		console.log("🔔 Starting notification delivery cron job")
		let deliveryResults: Array<{
			userID: string
			notificationCount: number
			success: boolean
		}> = []
		let processingPromises: Promise<void>[] = []

		// TODO: Replace with Jazz-based user enumeration in task 9
		// for await (let user of getUsersWithJazz()) {
		// 	await waitForConcurrencyLimit(processingPromises, maxConcurrentUsers)
		// 	let userPromise = loadNotificationSettings(user)
		// 		.then(data => shouldReceiveNotification(data))
		// 		.then(data => hasDueNotifications(data))
		// 		.then(data => getDevices(data))
		// 		.then(userWithDevices => processDevicesPipeline(userWithDevices))
		// 		.then(results => {
		// 			deliveryResults.push(...results)
		// 		})
		// 		.catch(error => {
		// 			if (typeof error === "string") {
		// 				console.log(`❌ User ${user.id}: ${error}`)
		// 			} else {
		// 				console.log(`❌ User ${user.id}: ${error.message || error}`)
		// 			}
		// 		})
		// 		.finally(() => removeFromList(processingPromises, userPromise))
		// 	processingPromises.push(userPromise)
		// }

		await Promise.allSettled(processingPromises)

		return c.json({
			message: `Processed ${deliveryResults.length} notification deliveries`,
			results: deliveryResults,
		})
	},
)

// Disabled for Clerk to Passkey migration - will be re-enabled with Jazz-based user enumeration
/*
async function loadNotificationSettings(user: User) {
	let workerResult = await tryCatch(initUserWorker(user))
	if (!workerResult.ok) {
		throw `Failed to init worker - ${workerResult.error}`
	}

	let workerWithSettings = await workerResult.data.worker.$jazz.ensureLoaded({
		resolve: settingsQuery,
	})
	let notificationSettings = workerWithSettings.root.notificationSettings
	if (!notificationSettings?.$isLoaded) {
		throw "No notification settings configured"
	}

	console.log(`✅ User ${user.id}: Loaded notification settings`)

	return {
		user,
		notificationSettings,
		worker: workerWithSettings,
		currentUtc: new Date(),
	}
}
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function shouldReceiveNotification<
	T extends {
		notificationSettings: LoadedNotificationSettings
		currentUtc: Date
		user: User
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function waitForConcurrencyLimit(
	promises: Promise<void>[],
	maxConcurrency: number,
) {
	if (promises.length >= maxConcurrency) {
		await Promise.race(promises)
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeFromList<T>(list: T[], item: T) {
	let index = list.indexOf(item)
	if (index > -1) list.splice(index, 1)
}

// Create localized notification payload based on user's language preference
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

type NotificationProcessingContext = {
	user: User
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
