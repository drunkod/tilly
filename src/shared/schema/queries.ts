// src/shared/schema/queries.ts
import { TillyAccount } from "./account"
import type { ResolveQuery, co } from "jazz-tools"

export const settingsQuery = {
  root: {
    notificationSettings: true,
    subscription: true,
  },
  profile: true,
} as const satisfies ResolveQuery<typeof TillyAccount>

export const peopleQuery = {
  root: {
    people: {
      $each: {
        reminders: { $each: true },
        notes: { $each: true },
      },
    },
  },
} as const satisfies ResolveQuery<typeof TillyAccount>

export const usageQuery = {
  root: {
    usageTracking: true,
    subscription: true,
  },
} as const satisfies ResolveQuery<typeof TillyAccount>

// Export typed versions
export type LoadedWithSettings = co.loaded<typeof TillyAccount, typeof settingsQuery>
export type LoadedWithPeople = co.loaded<typeof TillyAccount, typeof peopleQuery>
export type LoadedWithUsage = co.loaded<typeof TillyAccount, typeof usageQuery>
