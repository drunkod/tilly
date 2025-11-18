import { co, z } from "#shared/jazz-core"

export let ServerAccount = co.account({
	profile: co.map({ name: z.string() }),
	root: co.map({}),
})
