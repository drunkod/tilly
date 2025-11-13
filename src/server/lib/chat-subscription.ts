import { tryCatch } from "#shared/lib/trycatch"
import { TillyAccount, SubscriptionData } from "#shared/schema/account"
import { co } from "jazz-tools"
import { PUBLIC_ENABLE_PAYWALL } from "astro:env/client"
import { createMiddleware } from "hono/factory"

export { requirePlus }

export type { SubscriptionStatus }

type SubscriptionTier = "plus" | "free"

type SubscriptionStatus = {
	hasPlusAccess: boolean
	tier: SubscriptionTier
	isTrial: boolean
	nextPaymentDate: Date | null
	source: "jazz" | "fallback"
}

type RequirePlusAppContext = {
	Variables: {
		jazzAccountId: string
		subscription: SubscriptionStatus
	}
}

let requirePlus = createMiddleware<RequirePlusAppContext>(async (c, next) => {
	let jazzAccountId = c.get("jazzAccountId")
	if (!jazzAccountId) {
		console.warn("[Subscription] Missing authenticated user for requirePlus")
		return c.json({ error: "Authentication required" }, 401)
	}

	let status = await getSubscriptionStatus(jazzAccountId)
	c.set("subscription", status)
	logSubscriptionStatus(jazzAccountId, status)

	if (!PUBLIC_ENABLE_PAYWALL) {
		console.warn(
			`[Subscription] ${jazzAccountId} | Plus check disabled | tier=${status.tier} | trial=${status.isTrial ? "yes" : "no"} | source=${status.source}`,
		)
		return next()
	}

	if (!status.hasPlusAccess) {
		console.warn(
			`[Subscription] ${jazzAccountId} | Access denied | tier=${status.tier} | trial=${status.isTrial ? "yes" : "no"} | source=${status.source}`,
		)
		return c.json({ error: "Plus subscription required" }, 403)
	}

	return next()
})

async function getSubscriptionStatus(
	jazzAccountId: string,
): Promise<SubscriptionStatus> {
	let accountResult = await tryCatch(
		TillyAccount.load(jazzAccountId, {
			resolve: { root: { subscription: true } },
		}),
	)

	if (!accountResult.ok || !accountResult.data) {
		console.warn(
			`[Subscription] ${jazzAccountId} | Failed to load account`,
			accountResult.error,
		)
		return {
			hasPlusAccess: false,
			tier: "free",
			isTrial: false,
			nextPaymentDate: null,
			source: "fallback",
		}
	}

	let account = accountResult.data
	let subscription = account.root?.subscription

	if (!subscription) {
		return {
			hasPlusAccess: false,
			tier: "free",
			isTrial: false,
			nextPaymentDate: null,
			source: "fallback",
		}
	}

	let snapshot = subscriptionSnapshotFromJazz(subscription)

	return { ...snapshot, source: "jazz" }
}

function subscriptionSnapshotFromJazz(
	subscription: co.loaded<typeof SubscriptionData>,
): Omit<SubscriptionStatus, "source"> {
	let tier: SubscriptionTier = subscription.tier || "free"
	let isTrial = subscription.isTrial || false
	let nextPaymentDate = subscription.nextPaymentDate || null

	return {
		hasPlusAccess: tier === "plus",
		tier,
		isTrial,
		nextPaymentDate,
	}
}

function logSubscriptionStatus(userId: string, status: SubscriptionStatus) {
	let nextPaymentLabel = status.nextPaymentDate
		? status.nextPaymentDate.toISOString()
		: "none"

	console.log(
		`[Subscription] ${userId} | tier=${status.tier} | trial=${status.isTrial ? "yes" : "no"} | source=${status.source} | nextPayment=${nextPaymentLabel}`,
	)
}
