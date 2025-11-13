// In-memory store (replace with database in production)
import { co, Group } from "jazz-tools"
import { TillyAccount } from "#shared/schema/account"
import { initServerWorker } from "./utils"

// Create a Jazz CoMap to track registered users
export const PushRegistry = co.map({
  users: co.list(co.string), // List of jazzAccountIds
})

import { PUSH_REGISTRY_ID } from "astro:env/server"
let _registry: co.loaded<typeof PushRegistry> | undefined

async function loadOrCreateRegistry() {
	if (_registry) return _registry
	let serverWorker = (await initServerWorker()).worker
	let registryId = PUSH_REGISTRY_ID as co.ID<typeof PushRegistry>

	let registry = await serverWorker.load(registryId)

	if (registry) {
		_registry = registry
		return registry
	}
	let group = Group.create({ owner: serverWorker })
	group.addMember("everyone", "writer")

	registry = PushRegistry.create(
		{
			users: [],
		},
		{ owner: group },
		registryId,
	)
	_registry = registry

	return registry
}

type RegisteredUser = {
	jazzAccountId: string
	registeredAt: Date
}

export async function registerUserForPush(jazzAccountId: string) {
  // Load/create registry from Jazz
  const registry = await loadOrCreateRegistry()

  if (!registry.users?.includes(jazzAccountId)) {
    registry.users?.$jazz.push(jazzAccountId)
  }
}

export async function unregisterUserFromPush(jazzAccountId: string) {
	const registry = await loadOrCreateRegistry()
	if (!registry.users) return
	let index = registry.users.indexOf(jazzAccountId)
	if (index > -1) {
		registry.users.$jazz.splice(index, 1)
	}
}

export async function* getRegisteredUsers(): AsyncGenerator<RegisteredUser> {
  const registry = await loadOrCreateRegistry()

  for (const jazzAccountId of registry.users || []) {
    yield {
      jazzAccountId,
      registeredAt: new Date() // Could store this in registry too
    }
  }
}

export async function isUserRegistered(jazzAccountId: string): Promise<boolean> {
	const registry = await loadOrCreateRegistry()
	return registry.users?.includes(jazzAccountId) ?? false
}
