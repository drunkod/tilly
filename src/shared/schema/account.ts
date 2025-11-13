import { co, Group, z } from "jazz-tools"
import { PersonList, NotificationSettings, UsageTracking } from "./user"

/** Public profile - visible to everyone */
export const UserProfile = co.profile({
name: z.string().optional(),
email: z.string().optional(),
})

/** Subscription data */
export const SubscriptionData = co.map({
tier: z.enum(["free", "plus"]),
status: z.string().optional(),
nextPaymentDate: z.date().optional(),
isTrial: z.boolean().optional(),
stripeCustomerId: z.string().optional(),
stripeSubscriptionId: z.string().optional(),
})

/** Account root - private data */
export const AccountRoot = co.map({
// Existing fields from user.ts
language: z.enum(["en", "de"]).optional(),
people: co.ref(PersonList).optional(),
notificationSettings: co.ref(NotificationSettings).optional(),

// Subscription
subscription: co.ref(SubscriptionData).optional(),

// Usage tracking
usageTracking: co.ref(UsageTracking).optional(),

// Legacy Clerk migration support
clerkUserId: z.string().optional(),
})

/** Main account schema */
export const TillyAccount = co
.account({
profile: UserProfile,
root: AccountRoot,
})
.withMigration(async (account) => {
// Initialize root if not exists
if (!account.$jazz.has("root")) {
account.$jazz.set("root", {
language: "en",
subscription: SubscriptionData.create({
tier: "free",
isTrial: false,
}),
})
}

// Initialize profile if not exists
if (!account.$jazz.has("profile")) {
const group = Group.create()
group.addMember("everyone", "reader")

account.$jazz.set(
"profile",
UserProfile.create(
{
name: "",
email: "",
},
group
)
)
}
})

export type TillyAccountType = typeof TillyAccount
