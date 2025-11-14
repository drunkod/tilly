#!/usr/bin/env tsx

import { UsageTracking } from "../src/shared/schema/user"
import { TillyAccount } from "../src/shared/schema/account"
import { getRegisteredUsers } from "../src/server/lib/user-registry"
import { startWorker } from "jazz-tools/worker"
import { ServerAccount } from "../src/shared/schema/server"

type ServerWorker = Awaited<ReturnType<typeof startWorker>>["worker"]

// Load environment variables
let PUBLIC_JAZZ_SYNC_SERVER = process.env.PUBLIC_JAZZ_SYNC_SERVER
let PUBLIC_JAZZ_WORKER_ACCOUNT = process.env.PUBLIC_JAZZ_WORKER_ACCOUNT
let JAZZ_WORKER_SECRET = process.env.JAZZ_WORKER_SECRET

if (
	!PUBLIC_JAZZ_SYNC_SERVER ||
	!PUBLIC_JAZZ_WORKER_ACCOUNT ||
	!JAZZ_WORKER_SECRET
) {
	console.error(
		"❌ Missing required Jazz environment variables: PUBLIC_JAZZ_SYNC_SERVER, PUBLIC_JAZZ_WORKER_ACCOUNT, JAZZ_WORKER_SECRET",
	)
	process.exit(1)
}

let jazzWorker: ServerWorker | null = null

async function initJazzWorker() {
	if (jazzWorker) return jazzWorker

	console.log("🎵 Initializing Jazz worker...")

	let workerResult = await startWorker({
		AccountSchema: ServerAccount,
		syncServer: PUBLIC_JAZZ_SYNC_SERVER,
		accountID: PUBLIC_JAZZ_WORKER_ACCOUNT,
		accountSecret: JAZZ_WORKER_SECRET,
		skipInboxLoad: true,
	})

	jazzWorker = workerResult.worker
	console.log("✅ Jazz worker initialized")
	return jazzWorker
}

async function resetUsageForUser(usageTrackingId: string, userId: string) {
	try {
		let usageTracking = await UsageTracking.load(usageTrackingId)
		if (!usageTracking?.$isLoaded) {
			console.warn(`  ⚠️  Usage tracking not found for user ${userId}`)
			return false
		}

		let usagePercent = usageTracking.weeklyPercentUsed ?? 0

		console.log(`  📊 Current usage: ${usagePercent.toFixed(1)}% of budget`)

		usageTracking.weeklyPercentUsed = 0

		console.log(`  ✅ Reset successfully`)
		return true
	} catch (error) {
		console.error(`  ❌ Failed to reset usage for user ${userId}:`, error)
		return false
	}
}

async function resetAllUsage() {
	console.log("🚀 Starting bulk usage reset...")

	// Initialize Jazz worker to load CoValues
	await initJazzWorker()

	try {
		console.log("📋 Fetching registered users...")

		let users = []

		for await (let user of getRegisteredUsers()) {
			users.push(user)
		}

		console.log(`📊 Found ${users.length} users`)

		let resetCount = 0
		let skipCount = 0

		for (let [index, user] of users.entries()) {
			console.log(
				`\n[${index + 1}/${users.length}] Processing user ${user.jazzAccountId}`,
			)

			// Load account to get usage tracking
			let account = await TillyAccount.load(user.jazzAccountId, {
				resolve: { root: { usageTracking: true } },
			})

			if (!account) {
				console.log(`  ⏭️  Account not found, skipping`)
				skipCount++
				continue
			}

			let usageTrackingId = account.root?.usageTracking?.$jazz.id

			if (!usageTrackingId) {
				console.log(`  ⏭️  No usage tracking found, skipping`)
				skipCount++
				continue
			}

			let success = await resetUsageForUser(usageTrackingId, user.jazzAccountId)
			if (success) {
				resetCount++
			}
		}

		console.log(`\n🎉 Reset completed!`)
		console.log(`✅ Successfully reset: ${resetCount} users`)
		console.log(`⏭️  Skipped (no usage tracking): ${skipCount} users`)
	} catch (error) {
		console.error("❌ Failed to reset usage:", error)
	}
}

async function resetSingleUser(usageTrackingId: string) {
	console.log(`🎯 Resetting usage for ID: ${usageTrackingId}`)

	// Initialize Jazz worker to load CoValues
	await initJazzWorker()

	await resetUsageForUser(usageTrackingId, "unknown")
}

// Main execution
async function main() {
	try {
		if (process.argv[2]) {
			await resetSingleUser(process.argv[2])
		} else {
			await resetAllUsage()
		}
		process.exit(0)
	} catch (error) {
		console.error("❌ Script failed:", error)
		process.exit(1)
	}
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main()
}

// Usage:
// tsx scripts/reset-usage.ts                    # Reset all users
// tsx scripts/reset-usage.ts <usageTrackingId> # Reset specific user
