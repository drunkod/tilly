# Clerk Integration

## Structure

- `client/` - React hooks and components (client-side only)
- `server/` - API client, middleware, and utilities (server-side only)

## Usage

### Client-side

```typescript
import { useAuth, useUser } from "#shared/clerk/client"
```

### Server-side

```typescript
import { authMiddleware, requireAuth } from "#shared/clerk/server"
```

## Middleware Stack

1. `authMiddleware` - Adds auth/user to context (optional)
2. `requireAuth` - Requires authentication
3. `requirePlus` - Requires Plus subscription
