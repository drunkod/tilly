# Cron Jobs Limitation After Clerk Migration

## Current Status

The push notification cron job (`/api/push/deliver-notifications`) has been temporarily disabled following the migration from Clerk to Jazz Passkey authentication.

## Why This Limitation Exists

### Clerk's Central User Enumeration
Previously, the cron job relied on Clerk's `getUsersWithJazz()` function to enumerate all users in the system. This allowed the server to:
- Iterate through all registered users
- Check each user's notification settings
- Send push notifications to users with due reminders

### Jazz's Local-First Architecture
Jazz is designed as a local-first system where:
- User data is distributed across devices
- There is no central "users table" by default
- The sync server stores encrypted data but doesn't provide user enumeration APIs
- This design prioritizes privacy and offline-first functionality

## Impact

Without central user enumeration, the cron job cannot:
- Discover all users in the system
- Proactively send scheduled push notifications
- Process reminders for users who are offline

## Future Solution: Global Directory CoMap

The recommended approach is to implement a **Global Directory CoMap** that acts as a user registry:

### Design Overview

```typescript
// Global directory CoMap
export let GlobalUserDirectory = co.map({
  users: co.list(UserAccount),
})

// On signup, users add themselves to the directory
function handleSignup() {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID)
  directory.users.$jazz.push(me)
}

// Server worker can iterate users
async function sendPushNotifications() {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID)
  for (const user of directory.users) {
    // Process notifications for each user
  }
}
```

### Implementation Considerations

1. **Opt-in Model**: Users must explicitly add themselves to the directory during signup
2. **Server Worker Access**: The server worker needs admin access to read the directory
3. **Privacy**: The directory only stores user account references, not sensitive data
4. **Scalability**: For large user bases, consider pagination or sharding strategies

### Steps to Implement

1. Create the `GlobalUserDirectory` schema in the user schema file
2. Update the signup flow to add new users to the directory
3. Grant the server worker read access to the directory
4. Update the cron job to iterate through the directory instead of using Clerk's API
4. Re-enable the cron job in `vercel.json`

## Temporary Workaround

Until the Global Directory is implemented, push notifications can still be triggered:
- Manually via the `/api/push/test` endpoint (for testing)
- Through client-side scheduling (less reliable, requires user to be online)

## Related Files

- `src/server/features/push-cron.ts` - Cron job implementation (commented out user enumeration)
- `vercel.json` - Cron job configuration (disabled)
- `src/shared/schema/user.ts` - User schema (where Global Directory should be added)

## References

- Jazz Documentation: [Server-Side Development](https://jazz.tools/docs/server-side/quickstart)
- Design Document: `.kiro/specs/clerk-to-passkey-migration/design.md`
- Requirements: `.kiro/specs/clerk-to-passkey-migration/requirements.md` (Requirement 8)
