# Global Directory Future Enhancement

## Overview

This document outlines a future enhancement to enable server-side user enumeration for push notification cron jobs using Jazz's Global Directory pattern.

## Current Limitation

Jazz's local-first architecture does not provide central user enumeration by default. This means:

- Server workers cannot iterate over all users
- Push notification cron jobs cannot be implemented
- See [CRON_JOBS_LIMITATION.md](CRON_JOBS_LIMITATION.md) for current workaround

## Proposed Solution: Global Directory CoMap

### Concept

Create a Global Directory CoMap that acts as a registry where users can opt-in to be discoverable by server workers.

### Implementation Design

#### 1. Schema Definition

```typescript
// Global directory for user registry
export const GlobalUserDirectory = co.map({
  users: co.list(UserAccount),
  lastUpdated: z.date(),
});

// Extend UserAccount to track directory membership
export const UserAccount = co.account({
  profile: UserProfile,
  root: UserAccountRoot,
}).withMigration(async (account) => {
  // Existing migration code...
  
  // Opt-in to global directory
  if (account.root.notificationSettings?.enabled) {
    await addToGlobalDirectory(account);
  }
});
```

#### 2. Directory Management

```typescript
// Add user to directory
async function addToGlobalDirectory(account: UserAccount) {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID);
  
  if (!directory.$isLoaded) return;
  
  // Check if user already in directory
  const exists = directory.users.some(
    user => user.$jazz.id === account.$jazz.id
  );
  
  if (!exists) {
    directory.users.$jazz.push(account);
    directory.$jazz.set('lastUpdated', new Date());
  }
}

// Remove user from directory
async function removeFromGlobalDirectory(accountId: string) {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID);
  
  if (!directory.$isLoaded) return;
  
  const index = directory.users.findIndex(
    user => user.$jazz.id === accountId
  );
  
  if (index !== -1) {
    directory.users.$jazz.splice(index, 1);
    directory.$jazz.set('lastUpdated', new Date());
  }
}
```

#### 3. Server Worker Integration

```typescript
// Push notification cron job
export async function sendPushNotifications() {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID, {
    loadAs: serverWorker,
    resolve: {
      users: {
        $each: {
          root: {
            notificationSettings: true,
            people: {
              $each: {
                reminders: {
                  $each: true
                }
              }
            }
          }
        }
      }
    }
  });
  
  if (!directory.$isLoaded) {
    console.error('Failed to load global directory');
    return;
  }
  
  // Iterate over all users
  for (const user of directory.users) {
    if (!user.$isLoaded) continue;
    
    // Process reminders for this user
    await processUserReminders(user);
  }
}
```

### Permissions Model

#### Directory Ownership

```typescript
// Create directory owned by server worker
const directoryGroup = Group.create(serverWorker);

// Server worker is admin
directoryGroup.addMember(serverWorker, 'admin');

// All users can write (to add themselves)
directoryGroup.addMember('everyone', 'writer');

const directory = GlobalUserDirectory.create({
  users: [],
  lastUpdated: new Date()
}, directoryGroup);
```

#### User Privacy

- Users opt-in by enabling notifications
- Users can opt-out by disabling notifications
- Server worker can only read what users explicitly share
- User data remains encrypted; only references are in directory

### Migration Path

#### Phase 1: Create Directory

1. Deploy server worker with directory creation code
2. Create global directory CoMap
3. Set up appropriate permissions

#### Phase 2: User Opt-In

1. Update UserAccount migration to add users to directory
2. Add UI toggle in Settings for directory membership
3. Migrate existing users who have notifications enabled

#### Phase 3: Enable Cron Jobs

1. Update push notification cron to use directory
2. Re-enable cron job in `vercel.json`
3. Test with subset of users
4. Roll out to all users

## Benefits

### For Users

- **Opt-in model**: Users control their directory membership
- **Privacy preserved**: Only references stored, data remains encrypted
- **Better notifications**: Reliable push notifications via cron

### For Developers

- **User enumeration**: Server can iterate over opted-in users
- **Scalable**: Directory grows with user base
- **Maintainable**: Single source of truth for user registry

### For System

- **Efficient**: Only load users who need processing
- **Reliable**: Cron jobs can run on schedule
- **Flexible**: Easy to add/remove users from directory

## Considerations

### Performance

- **Directory size**: May grow large with many users
- **Load time**: Need to optimize directory loading
- **Pagination**: Consider paginating user list for large directories

**Mitigation**:
```typescript
// Load directory in batches
async function* loadUsersInBatches(batchSize = 100) {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID);
  
  for (let i = 0; i < directory.users.length; i += batchSize) {
    const batch = directory.users.slice(i, i + batchSize);
    yield batch;
  }
}
```

### Privacy

- **User visibility**: Users in directory are discoverable
- **Data exposure**: Only references, not actual data
- **Consent**: Clear opt-in/opt-out mechanism needed

**Mitigation**:
- Clear privacy policy explaining directory
- Prominent opt-in/opt-out controls
- Audit logging of directory access

### Reliability

- **Directory corruption**: Single point of failure
- **Sync conflicts**: Multiple workers updating directory
- **Stale data**: Users who deleted accounts remain in directory

**Mitigation**:
```typescript
// Periodic cleanup of stale users
async function cleanupDirectory() {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID);
  
  for (const user of directory.users) {
    try {
      await user.$jazz.ensureLoaded({ resolve: { profile: true } });
    } catch (error) {
      // User account no longer accessible, remove from directory
      await removeFromGlobalDirectory(user.$jazz.id);
    }
  }
}
```

## Alternative Approaches

### 1. Per-User Cron Jobs

Instead of global directory, each user gets their own cron job.

**Pros**:
- No global directory needed
- Better isolation
- Easier to scale

**Cons**:
- Complex to manage many cron jobs
- Higher infrastructure costs
- Harder to implement

### 2. Client-Side Scheduling

Use service workers to schedule notifications client-side.

**Pros**:
- No server-side enumeration needed
- Works offline
- Lower server costs

**Cons**:
- Requires device to be online
- Battery drain concerns
- Less reliable than server-side

### 3. Webhook-Based

Users register webhooks that server calls.

**Pros**:
- No directory needed
- Flexible integration
- User-controlled

**Cons**:
- Requires user to run webhook server
- Complex for average users
- Not suitable for consumer app

## Implementation Timeline

### Short Term (Current)

- ✅ Document limitation
- ✅ Disable cron jobs
- ✅ Plan future enhancement

### Medium Term (Next Quarter)

- [ ] Implement Global Directory schema
- [ ] Add opt-in/opt-out UI
- [ ] Test with small user group
- [ ] Monitor performance and privacy

### Long Term (Future)

- [ ] Roll out to all users
- [ ] Re-enable push notification cron
- [ ] Optimize directory performance
- [ ] Add analytics and monitoring

## Testing Strategy

### Unit Tests

```typescript
describe('Global Directory', () => {
  it('should add user to directory', async () => {
    const user = await createTestUser();
    await addToGlobalDirectory(user);
    
    const directory = await GlobalUserDirectory.load(DIRECTORY_ID);
    expect(directory.users).toContain(user);
  });
  
  it('should remove user from directory', async () => {
    const user = await createTestUser();
    await addToGlobalDirectory(user);
    await removeFromGlobalDirectory(user.$jazz.id);
    
    const directory = await GlobalUserDirectory.load(DIRECTORY_ID);
    expect(directory.users).not.toContain(user);
  });
});
```

### Integration Tests

```typescript
describe('Push Notification Cron', () => {
  it('should process all users in directory', async () => {
    const users = await createTestUsers(10);
    for (const user of users) {
      await addToGlobalDirectory(user);
    }
    
    await sendPushNotifications();
    
    // Verify all users were processed
    for (const user of users) {
      expect(user.lastNotificationCheck).toBeDefined();
    }
  });
});
```

### Load Tests

- Test with 1,000 users in directory
- Test with 10,000 users in directory
- Test concurrent directory updates
- Test directory cleanup performance

## Security Considerations

### Access Control

- Only server worker can read full directory
- Users can only add/remove themselves
- Admin can manage directory (cleanup, etc.)

### Audit Logging

```typescript
// Log directory access
async function auditDirectoryAccess(
  action: 'read' | 'write' | 'delete',
  userId: string
) {
  await AuditLog.create({
    timestamp: new Date(),
    action,
    userId,
    resource: 'global-directory'
  });
}
```

### Rate Limiting

```typescript
// Prevent directory spam
const rateLimiter = new Map<string, number>();

async function addToGlobalDirectory(account: UserAccount) {
  const lastAdd = rateLimiter.get(account.$jazz.id);
  if (lastAdd && Date.now() - lastAdd < 60000) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimiter.set(account.$jazz.id, Date.now());
  // ... rest of implementation
}
```

## Documentation Updates Needed

When implementing this feature:

1. Update [CRON_JOBS_LIMITATION.md](CRON_JOBS_LIMITATION.md) to reflect new capability
2. Add privacy policy section about directory
3. Update Settings UI documentation
4. Add developer guide for directory usage
5. Update deployment guide with directory setup

## References

- [Jazz Documentation](https://jazz.tools/docs)
- [Jazz CoMap Documentation](https://jazz.tools/docs/core-concepts/covalues/comaps)
- [Jazz Permissions](https://jazz.tools/docs/permissions-and-sharing/overview)
- [CRON_JOBS_LIMITATION.md](CRON_JOBS_LIMITATION.md)

## Questions and Feedback

For questions or suggestions about this enhancement:
- File an issue on GitHub
- Discuss on Discord
- Email: assmann@hey.com
