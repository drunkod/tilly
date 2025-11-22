# Design Document

## Overview

This design document outlines the technical approach for migrating the Tilly application from Clerk authentication to Jazz's native Passkey authentication system. The migration will replace all Clerk-specific code with Jazz's built-in authentication primitives while maintaining the existing user experience and functionality.

The design leverages Jazz's local-first architecture, WebAuthn-based passkey authentication, and cryptographic token-based API authentication to create a simpler, more integrated authentication system.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  JazzReactProvider (replaces ClerkProvider)            │ │
│  │  - Manages Jazz context and sync                       │ │
│  │  - Handles account lifecycle                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────────┐   │
│  │                                                       │   │
│  │  ┌──────────────────┐      ┌──────────────────┐    │   │
│  │  │ PasskeyAuthDialog│      │  usePasskeyAuth  │    │   │
│  │  │  - Signup UI     │      │  - signUp()      │    │   │
│  │  │  - Login UI      │      │  - logIn()       │    │   │
│  │  └──────────────────┘      └──────────────────┘    │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  generateAuthToken()                         │   │   │
│  │  │  - Creates signed JWT-style tokens          │   │   │
│  │  │  - Attached to API requests                 │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS + Auth Token
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Server Worker                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  authenticateRequest()                                  │ │
│  │  - Validates Jazz auth tokens                          │ │
│  │  - Loads authenticated account                         │ │
│  │  - Returns account or error                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────────┐   │
│  │  Chat API Handler                                    │   │
│  │  - Uses authenticated account as context            │   │
│  │  - Processes chat messages                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Jazz Sync Protocol
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Jazz Sync Server                          │
│  - Handles real-time data synchronization                   │
│  - Stores encrypted CoValues                                │
│  - Manages peer connections                                 │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

**Signup Flow:**
1. User clicks "Sign Up" → PasskeyAuthDialog opens
2. User enters display name
3. `usePasskeyAuth().signUp(name)` called
4. Browser prompts for WebAuthn credential creation
5. Jazz creates new account with passkey
6. Account migration runs, creates public profile
7. User is authenticated and redirected to app

**Login Flow:**
1. User clicks "Log In" → Browser passkey prompt
2. `usePasskeyAuth().logIn()` called
3. Browser prompts for WebAuthn credential
4. Jazz authenticates using passkey
5. Account loaded from Jazz sync server
6. User is authenticated and redirected to app

**API Request Flow:**
1. Client generates auth token: `generateAuthToken()`
2. Token attached to request: `Authorization: Jazz <token>`
3. Server validates token: `authenticateRequest(request)`
4. Server loads account from token
5. Server processes request with authenticated context

## Components and Interfaces

### 1. PasskeyAuthDialog Component

**Location:** `src/app/components/passkey-auth.tsx`

**Purpose:** Provides UI for passkey signup and login

**Interface:**
```typescript
interface PasskeyAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "signup" | "login"
}

function PasskeyAuthDialog(props: PasskeyAuthDialogProps): JSX.Element
```

**Key Features:**
- Dual-mode dialog (signup/login)
- Username input for signup
- Integration with `usePasskeyAuth` hook
- Error handling and loading states
- Uses Shadcn UI components (Dialog, Button, Input, Label)

**Dependencies:**
- `jazz-tools/react` - usePasskeyAuth hook
- `#shared/ui/*` - Shadcn UI components

### 2. JazzReactProvider Configuration

**Location:** `src/app/main.tsx`

**Purpose:** Replaces ClerkProvider with Jazz provider

**Configuration:**
```typescript
<JazzReactProvider
  AccountSchema={UserAccount}
  sync={{ peer: PUBLIC_JAZZ_SYNC_SERVER }}
>
  {children}
</JazzReactProvider>
```

**Key Changes:**
- Remove ClerkProvider wrapper
- Add JazzReactProvider with UserAccount schema
- Configure sync server connection
- No additional auth configuration needed

### 3. Updated UserAccount Schema

**Location:** `src/shared/schema/user.ts`

**Purpose:** Ensures public profile creation on account initialization

**Migration Logic:**
```typescript
export let UserAccount = co.account({
  profile: UserProfile,
  root: UserAccountRoot,
}).withMigration(async account => {
  // Initialize Root
  if (account.root === undefined) {
    // ... existing root initialization ...
  }
  
  // Initialize Profile with public group
  if (account.profile === undefined) {
    const group = Group.create({ owner: account })
    group.addMember("everyone", "reader") // Make public!
    account.$jazz.set("profile",
      UserProfile.create({ name: "New User" }, { owner: group })
    )
  }
  
  // ... existing cleanup logic ...
})
```

**Key Features:**
- Creates public profile group on first run
- Grants "everyone" reader access
- Initializes with default name
- Runs automatically on account creation

### 4. Settings Page Authentication Section

**Location:** `src/app/routes/_app.settings.tsx`

**Purpose:** Displays authentication status and controls

**Interface:**
```typescript
function AuthenticationSection(): JSX.Element
```

**Key Features:**
- Shows authenticated/unauthenticated state
- Displays passkey indicator when logged in
- Provides login/signup buttons when logged out
- Session refresh button (simple logout)
- Disables actions when offline

**Dependencies:**
- `useIsAuthenticated()` - Check auth status
- `usePasskeyAuth()` - Access auth methods
- `useOnlineStatus()` - Check network status

### 5. Welcome Page Sign In

**Location:** `src/app/routes/index.tsx`

**Purpose:** Quick sign-in from landing page

**Implementation:**
```typescript
function WelcomeIndex() {
  const setTourSkipped = useAppStore(state => state.setTourSkipped)
  const auth = usePasskeyAuth({ appName: APP_NAME })
  
  function handleSignIn() {
    setTourSkipped(true)
    auth.logIn() // Triggers browser passkey modal
  }
  
  // ... render with handleSignIn on button ...
}
```

**Key Features:**
- Single-click passkey login
- Skips tour on successful login
- Uses browser's native passkey UI

### 6. Client-Side API Authentication

**Location:** `src/app/routes/_app.assistant.tsx`

**Purpose:** Attach auth tokens to API requests

**Implementation:**
```typescript
import { generateAuthToken } from "jazz-tools"

const { messages, input, handleSubmit } = useChat({
  api: "/api/chat",
  headers: {
    "Authorization": `Jazz ${generateAuthToken()}`
  }
})
```

**Key Features:**
- Generates cryptographically signed token
- Attaches to Authorization header
- Token includes account identity
- Short-lived (60 second default)

### 7. Server-Side API Authentication

**Location:** `src/server/features/chat-messages.ts`

**Purpose:** Validate auth tokens and load accounts

**Implementation:**
```typescript
import { authenticateRequest } from "jazz-tools"

let chatMessagesApp = new Hono().post("/", async c => {
  // Validate Jazz Token
  const { account, error } = await authenticateRequest(c.req.raw, {
    // loadAs: serverWorker // if needed
  })
  
  if (!account) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  // Proceed with chat logic using 'account' as user context
  // ...
})
```

**Key Features:**
- Validates cryptographic signature
- Loads authenticated account
- Returns 401 on failure
- Provides account context for request

## Data Models

### UserAccount Schema

```typescript
// Profile with public visibility
export let UserProfile = co.profile({
  name: z.string(),
})

// Account root (private data)
export let UserAccountRoot = co.map({
  people: co.list(Person),
  notificationSettings: co.optional(NotificationSettings),
  // ... other private data ...
})

// Account with migration
export let UserAccount = co.account({
  profile: UserProfile,
  root: UserAccountRoot,
}).withMigration(async account => {
  // Ensure root exists
  if (account.root === undefined) {
    account.$jazz.set("root", {
      people: co.list(Person).create([]),
      // ... initialize other fields ...
    })
  }
  
  // Ensure public profile exists
  if (account.profile === undefined) {
    const group = Group.create({ owner: account })
    group.addMember("everyone", "reader")
    account.$jazz.set("profile",
      UserProfile.create({ name: "New User" }, { owner: group })
    )
  }
})
```

### Authentication Token Structure

Jazz auth tokens are cryptographically signed and contain:
- Account ID (public key)
- Timestamp (for expiration)
- Signature (proves authenticity)

The token is opaque to the application but validated by Jazz's `authenticateRequest()`.

## Error Handling

### Client-Side Error Handling

**Passkey Authentication Errors:**
```typescript
try {
  await auth.signUp(username)
  onOpenChange(false)
} catch (err) {
  console.error("Auth failed", err)
  alert("Authentication failed. Please try again.")
}
```

**Scenarios:**
- User cancels passkey prompt → Show friendly message
- Browser doesn't support WebAuthn → Disable passkey option
- Network error during sync → Show offline message

### Server-Side Error Handling

**Token Validation Errors:**
```typescript
const { account, error } = await authenticateRequest(c.req.raw)

if (error) {
  return c.json({ error: "Invalid or expired token" }, 401)
}

if (!account) {
  return c.json({ error: "Unauthorized" }, 401)
}
```

**Scenarios:**
- Invalid token signature → 401 Unauthorized
- Expired token → 401 Unauthorized
- Account not found → 401 Unauthorized
- Server worker not initialized → 500 Internal Server Error

### Offline Handling

**Client-Side:**
```typescript
const isOnline = useOnlineStatus()

<Button 
  onClick={() => auth.logIn()} 
  disabled={!isOnline}
>
  Log In with Passkey
</Button>
```

**Behavior:**
- Disable auth actions when offline
- Show offline indicator in UI
- Queue auth attempts for when online

## Testing Strategy

### Unit Tests

**1. PasskeyAuthDialog Component**
- Test signup mode renders username input
- Test login mode hides username input
- Test submit button triggers correct auth method
- Test error handling displays messages
- Test loading states disable interactions

**2. Account Schema Migration**
- Test root initialization creates expected structure
- Test profile initialization creates public group
- Test "everyone" reader permission is set
- Test migration is idempotent (safe to run multiple times)

**3. Auth Token Generation**
- Test `generateAuthToken()` returns valid token string
- Test token includes account identity
- Test token can be validated by server

### Integration Tests

**1. Signup Flow**
- Test complete signup creates new account
- Test profile is publicly readable
- Test user is redirected after signup
- Test account data persists after refresh

**2. Login Flow**
- Test login with existing passkey succeeds
- Test login loads correct account data
- Test login redirects to main app
- Test failed login shows error

**3. API Authentication**
- Test authenticated requests succeed
- Test unauthenticated requests return 401
- Test expired tokens return 401
- Test invalid tokens return 401

**4. Settings Page**
- Test authenticated state shows correct UI
- Test unauthenticated state shows login options
- Test logout clears session
- Test offline state disables actions

### Manual Testing Checklist

- [ ] New user can sign up with passkey
- [ ] Returning user can log in with passkey
- [ ] Profile is visible to other users
- [ ] Chat API works with Jazz auth tokens
- [ ] Settings page shows correct auth status
- [ ] Welcome page sign-in works
- [ ] Offline mode disables auth actions
- [ ] Browser passkey UI appears correctly
- [ ] Error messages are user-friendly
- [ ] TypeScript compilation succeeds
- [ ] No Clerk references remain in code

## Migration Considerations

### Breaking Changes

**Cron Job Functionality:**
- Clerk provided central user enumeration via `getUsersWithJazz()`
- Jazz does not provide this by default (local-first architecture)
- Push notification cron job will be temporarily disabled
- Future solution: Implement Global Directory CoMap where users register themselves

**Session Management:**
- Clerk sessions were managed server-side
- Jazz sessions are managed client-side with local storage
- "Logout" is effectively clearing local storage and refreshing
- No server-side session invalidation needed

### Data Migration

**No User Data Migration Required:**
- This is an authentication system change only
- Existing Jazz CoValues remain unchanged
- User data structures (Person, Note, Reminder) unchanged
- No database migration needed

**Account Continuity:**
- Existing users will need to create new passkeys
- Old Clerk accounts cannot be automatically migrated
- Consider communication plan for existing users
- May need temporary dual-auth support period

### Rollback Plan

**If Migration Fails:**
1. Revert code changes via git
2. Reinstall Clerk packages: `pnpm add @clerk/clerk-react @clerk/backend`
3. Restore Clerk environment variables
4. Redeploy previous version
5. Investigate issues before retry

**Rollback Triggers:**
- Critical authentication failures
- Data loss or corruption
- Unacceptable user experience degradation
- Security vulnerabilities discovered

## Security Considerations

### Passkey Security

**Strengths:**
- Phishing-resistant (domain-bound credentials)
- No password to steal or leak
- Biometric authentication (where supported)
- Private keys never leave device

**Considerations:**
- Users must understand passkey backup/sync
- Lost device = lost access (unless passkey synced)
- Browser/OS support required
- Consider fallback auth method for edge cases

### Token Security

**Strengths:**
- Cryptographically signed (tamper-proof)
- Short-lived (60 second default)
- Includes account identity
- Validated server-side

**Considerations:**
- Tokens sent over HTTPS only
- No token refresh mechanism (generate new on each request)
- Token replay possible within expiration window
- Consider shorter expiration for sensitive operations

### Local Storage Security

**Considerations:**
- Passkey credentials stored in browser local storage
- Vulnerable to XSS attacks
- Must sanitize all user input
- Set appropriate CSP headers
- Avoid third-party JavaScript where possible

**Mitigations:**
- Use DOMPurify for user-generated content
- Implement strict Content Security Policy
- Regular security audits
- Monitor for XSS vulnerabilities

## Performance Considerations

### Authentication Performance

**Passkey Operations:**
- Signup: ~1-2 seconds (browser UI + key generation)
- Login: ~1-2 seconds (browser UI + key verification)
- Faster than password + 2FA flows
- No network round-trip for credential verification

**Token Generation:**
- Negligible overhead (<1ms)
- Synchronous operation
- No network requests
- Can be cached per request

### Server Performance

**Token Validation:**
- Fast cryptographic verification (<1ms)
- Account loading depends on Jazz sync
- Consider caching loaded accounts
- No external API calls (unlike Clerk)

**Reduced Latency:**
- No Clerk API round-trips
- Fewer network hops
- Simpler authentication flow
- Better offline support

## Deployment Strategy

### Phase 1: Preparation
1. Review and approve requirements and design
2. Create feature branch: `feat/passkey-migration`
3. Set up testing environment
4. Document rollback procedures

### Phase 2: Implementation
1. Remove Clerk dependencies
2. Implement PasskeyAuthDialog component
3. Update UserAccount schema migration
4. Replace ClerkProvider with JazzReactProvider
5. Update Settings page
6. Update Welcome page
7. Implement client-side token generation
8. Implement server-side token validation
9. Disable Clerk-dependent cron jobs

### Phase 3: Testing
1. Run unit tests
2. Run integration tests
3. Manual testing checklist
4. Security review
5. Performance testing
6. Cross-browser testing

### Phase 4: Deployment
1. Merge to main branch
2. Deploy to staging environment
3. Smoke test staging
4. Deploy to production
5. Monitor for errors
6. Communicate changes to users

### Phase 5: Post-Deployment
1. Monitor authentication metrics
2. Gather user feedback
3. Address any issues
4. Document lessons learned
5. Plan Global Directory implementation for cron jobs

## Future Enhancements

### Global User Directory

**Purpose:** Enable server-side user enumeration for cron jobs

**Design:**
```typescript
// Global directory CoMap
export let GlobalUserDirectory = co.map({
  users: co.list(UserAccount),
})

// On signup, add user to directory
function handleSignup() {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID)
  directory.users.$jazz.push(me)
}

// Server worker can iterate users
async function sendPushNotifications() {
  const directory = await GlobalUserDirectory.load(DIRECTORY_ID)
  for (const user of directory.users) {
    // Send notification to user
  }
}
```

**Considerations:**
- Single source of truth for user list
- Requires server worker with admin access
- Users must opt-in to directory
- Privacy implications of global user list

### Passphrase Backup

**Purpose:** Provide recovery method if passkey is lost

**Implementation:**
- Generate BIP39-style recovery phrase
- Display once during signup
- User must save securely
- Can restore account from phrase

**Reference:** Jazz passphrase auth documentation

### Multi-Device Passkey Sync

**Purpose:** Seamless authentication across devices

**Implementation:**
- Leverage browser/OS passkey sync (iCloud Keychain, Google Password Manager)
- Educate users on enabling sync
- Provide manual passkey export/import option

### Session Management UI

**Purpose:** View and manage active sessions

**Features:**
- List active devices/sessions
- Revoke specific sessions
- View last activity timestamps
- Security alerts for unusual activity

## Conclusion

This design provides a comprehensive approach to migrating from Clerk to Jazz Passkey authentication. The migration simplifies the authentication stack, reduces external dependencies, and leverages Jazz's local-first architecture while maintaining security and user experience.

Key benefits:
- Simpler codebase (fewer dependencies)
- Better offline support
- Faster authentication (no external API calls)
- More secure (passkey-based, phishing-resistant)
- Better integration with Jazz ecosystem

The phased deployment strategy and comprehensive testing plan ensure a smooth migration with minimal risk to users.
