import { clerkClient } from "#shared/clerk/server"
import type { User } from "@clerk/backend"

export { getAllUsers, getUsersWithJazz }

async function* getAllUsers() {
	let offset = 0
	let limit = 500 // Max limit is 500

	while (true) {
		let response = await clerkClient.users.getUserList({
			limit,
			offset,
		})

		for (let user of response.data) {
			yield user
		}

		if (response.data.length < limit) {
			break
		}

		offset += limit
	}
}

async function* getUsersWithJazz(): AsyncGenerator<User> {
	let totalUsers = 0
	let jazzUsers = 0

	for await (let user of getAllUsers()) {
		totalUsers++
		if (
			user.unsafeMetadata.jazzAccountID &&
			user.unsafeMetadata.jazzAccountSecret
		) {
			jazzUsers++
			yield user
		}
	}

	console.log(
		`🚀 Found ${jazzUsers} users with Jazz accounts out of ${totalUsers} total users`,
	)
}
