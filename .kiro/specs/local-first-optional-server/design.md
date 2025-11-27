# Design Document

## Overview

This design document outlines the technical approach for refactoring Tilly to support local-first operation with optional server features. The app already uses Jazz for local-first data storage, so the main work involves making server features (AI chat, push notifications) optional and enabling static site deployment to GitHub Pages.

The design maintains backward compatibility with existing Vercel/Node deployments while adding a new static deployment path for users who don't need server features.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Deployment Options                                │
├─────────────────────────────────┬───────────────────────────────────────┤
│     Static (GitHub Pages)       │      Server (Vercel/Node)             │
│  ┌───────────────────────────┐  │  ┌─────────────────────────────────┐  │
│  │  Static HTML/JS/CSS       │  │  │  SSR + API Routes               │  │
│  │  - No server runtime      │  │  │  - Full server features         │  │
│  │  - Client-side routing    │  │  │  - AI Chat API                  │  │
│  │  - Optional server URL    │  │  │  - Push Notification Delivery   │  │
│  └───────────────────────────┘  │  └─────────────────────────────────┘  │
└─────────────────────────────────┴───────────────────────────────────────┘
                    │                              │
                    └──────────────┬───────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Client Application                               │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  JazzReactProvider                                                  │ │
│  │  - Local-first data storage (always works)                         │ │
│  │  - Offline support (always works)                                  │ │
│  │  - Real-time sync (always works)                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                   │                                      │
│  ┌────────────────────────────────┴─────────────────────────────────┐   │
│  │                    Feature Detection Layer                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │   │
│  │  │ hasServerFeatures│  │ hasAIChat        │  │ hasPushNotifs  │  │   │
│  │  │ - Check settings │  │ - Check server   │  │ - Check server │  │   │
│  │  │ - Check env vars │  │ - Check enabled  │  │ - Check browser│  │   │
│  │  └──────────────────┘  └──────────────────┘  └────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                   │                                      │
│  ┌────────────────────────────────┴─────────────────────────────────┐   │
│  │                    API Client with Fallback                       │   │
│  │  - getServerUrl() → user settings or env var                     │   │
│  │  - isServerAvailable() → health check                            │   │
│  │  - callChatAPI() → with graceful degradation                     │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Optional (if server configured)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Optional Server (Self-Hosted)                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  /api/chat - AI Chat Endpoint                                      │ │
│  │  /api/push - Push Notification Delivery                            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Build Configuration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Build Configuration                               │
├─────────────────────────────────┬───────────────────────────────────────┤
│     pnpm build:static           │      pnpm build (default)             │
│  ┌───────────────────────────┐  │  ┌─────────────────────────────────┐  │
│  │  output: "static"         │  │  │  output: "server"               │  │
│  │  No adapter               │  │  │  Vercel/Node adapter            │  │
│  │  Server vars optional     │  │  │  Server vars required           │  │
│  │  API routes excluded      │  │  │  API routes included            │  │
│  └───────────────────────────┘  │  └─────────────────────────────────┘  │
└─────────────────────────────────┴───────────────────────────────────────┘
```

## Components and Interfaces

### 1. Server Settings Schema

**Location:** `src/shared/schema/server-settings.ts`

**Purpose:** Define user-configurable server settings stored in Jazz

```typescript
import { co, z } from "jazz-tools"

export { ServerSettings }

let ServerSettings = co.map({
  serverUrl: z.string().optional(),
  enableAIChat: z.boolean().optional(),
  enablePushNotifications: z.boolean().optional(),
  apiKey: z.string().optional(),
})
```

### 2. Updated UserAccountRoot Schema

**Location:** `src/shared/schema/user.ts`

**Changes:** Add serverSettings field

```typescript
export let UserAccountRoot = co.map({
  people: co.list(Person),
  notificationSettings: NotificationSettings.optional(),
  usageTracking: UsageTracking.optional(),
  language: z.enum(["de", "en"]).optional(),
  serverSettings: ServerSettings.optional(), // NEW
})
```

### 3. Feature Detection Module

**Location:** `src/app/lib/feature-detection.ts`

**Purpose:** Runtime detection of available features

```typescript
import { co } from "jazz-tools"
import type { UserAccount } from "#shared/schema/user"

export { hasServerFeatures, hasAIChat, hasPushNotifications, getFeatureStatus }

type FeatureStatus = {
  serverConfigured: boolean
  aiChatAvailable: boolean
  pushNotificationsAvailable: boolean
  serverUrl: string | null
}

function hasServerFeatures(me: co.loaded<typeof UserAccount> | null): boolean {
  // Check user settings first
  let serverUrl = me?.root?.serverSettings?.serverUrl
  if (serverUrl) return true
  
  // Fall back to environment variable
  let envServerUrl = import.meta.env.PUBLIC_SERVER_URL
  return !!envServerUrl
}

function hasAIChat(me: co.loaded<typeof UserAccount> | null): boolean {
  if (!hasServerFeatures(me)) return false
  
  // Check if explicitly disabled in settings
  let enabled = me?.root?.serverSettings?.enableAIChat
  return enabled !== false // Default to true if server available
}

function hasPushNotifications(me: co.loaded<typeof UserAccount> | null): boolean {
  if (!hasServerFeatures(me)) return false
  
  // Check browser support
  if (!("PushManager" in window) || !("Notification" in window)) return false
  
  // Check if explicitly disabled in settings
  let enabled = me?.root?.serverSettings?.enablePushNotifications
  return enabled !== false
}

function getFeatureStatus(me: co.loaded<typeof UserAccount> | null): FeatureStatus {
  let serverUrl = me?.root?.serverSettings?.serverUrl || 
                  import.meta.env.PUBLIC_SERVER_URL || null
  
  return {
    serverConfigured: !!serverUrl,
    aiChatAvailable: hasAIChat(me),
    pushNotificationsAvailable: hasPushNotifications(me),
    serverUrl,
  }
}
```

### 4. API Client with Fallback

**Location:** `src/app/lib/api-client-with-fallback.ts`

**Purpose:** Abstract API calls with server availability checking

```typescript
import { co } from "jazz-tools"
import type { UserAccount } from "#shared/schema/user"
import { tryCatch } from "#shared/lib/trycatch"

export { getServerUrl, isServerAvailable, createApiClient }

function getServerUrl(me: co.loaded<typeof UserAccount> | null): string | null {
  // User settings take priority
  let userServerUrl = me?.root?.serverSettings?.serverUrl
  if (userServerUrl) return userServerUrl
  
  // Fall back to environment variable
  return import.meta.env.PUBLIC_SERVER_URL || null
}

async function isServerAvailable(serverUrl: string): Promise<boolean> {
  let result = await tryCatch(
    fetch(`${serverUrl}/health`, { 
      method: "GET",
      signal: AbortSignal.timeout(5000)
    })
  )
  
  if (!result.ok) return false
  return result.value.ok
}

function createApiClient(me: co.loaded<typeof UserAccount> | null) {
  let serverUrl = getServerUrl(me)
  
  return {
    serverUrl,
    isConfigured: !!serverUrl,
    
    async chat(messages: unknown[], options?: RequestInit) {
      if (!serverUrl) {
        throw new Error("Server not configured. Configure server URL in settings.")
      }
      
      let response = await fetch(`${serverUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify({ messages }),
        ...options,
      })
      
      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`)
      }
      
      return response
    },
    
    async testConnection(): Promise<{ ok: boolean; error?: string }> {
      if (!serverUrl) {
        return { ok: false, error: "Server URL not configured" }
      }
      
      let result = await tryCatch(isServerAvailable(serverUrl))
      if (!result.ok) {
        return { ok: false, error: result.error.message }
      }
      
      return { ok: result.value }
    },
  }
}
```

### 5. Server Settings UI Component

**Location:** `src/app/features/server-settings.tsx`

**Purpose:** UI for configuring server features in settings

```typescript
import { useState } from "react"
import { co } from "jazz-tools"
import { useIntl } from "#shared/intl"
import { SettingsSection } from "#app/components/settings-section"
import { Input } from "#shared/ui/input"
import { Switch } from "#shared/ui/switch"
import { Button } from "#shared/ui/button"
import { Label } from "#shared/ui/label"
import { ServerSettings } from "#shared/schema/server-settings"
import { createApiClient, getServerUrl } from "#app/lib/api-client-with-fallback"
import type { UserAccount } from "#shared/schema/user"

export { ServerSettingsSection }

type Props = {
  me: co.loaded<typeof UserAccount, { root: { serverSettings: true } }>
}

function ServerSettingsSection({ me }: Props) {
  let t = useIntl()
  let [testing, setTesting] = useState(false)
  let [testResult, setTestResult] = useState<{ ok: boolean; error?: string } | null>(null)
  
  let settings = me.root.serverSettings
  let serverUrl = settings?.serverUrl || ""
  let enableAIChat = settings?.enableAIChat ?? true
  let enablePush = settings?.enablePushNotifications ?? true
  
  function ensureSettings() {
    if (!me.root.serverSettings) {
      me.root.$jazz.set("serverSettings", ServerSettings.create({}))
    }
    return me.root.serverSettings!
  }
  
  function handleServerUrlChange(url: string) {
    let s = ensureSettings()
    s.$jazz.set("serverUrl", url || undefined)
    setTestResult(null)
  }
  
  function handleAIChatToggle(enabled: boolean) {
    let s = ensureSettings()
    s.$jazz.set("enableAIChat", enabled)
  }
  
  function handlePushToggle(enabled: boolean) {
    let s = ensureSettings()
    s.$jazz.set("enablePushNotifications", enabled)
  }
  
  async function handleTestConnection() {
    setTesting(true)
    setTestResult(null)
    
    let client = createApiClient(me)
    let result = await client.testConnection()
    
    setTestResult(result)
    setTesting(false)
  }
  
  return (
    <SettingsSection
      title={t("settings.server.title")}
      description={t("settings.server.description")}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serverUrl">{t("settings.server.url.label")}</Label>
          <div className="flex gap-2">
            <Input
              id="serverUrl"
              type="url"
              placeholder="https://your-server.com"
              value={serverUrl}
              onChange={e => handleServerUrlChange(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={!serverUrl || testing}
            >
              {testing ? t("common.testing") : t("settings.server.test")}
            </Button>
          </div>
          {testResult && (
            <p className={testResult.ok ? "text-green-600" : "text-red-600"}>
              {testResult.ok 
                ? t("settings.server.connected") 
                : testResult.error || t("settings.server.connectionFailed")}
            </p>
          )}
        </div>
        
        {serverUrl && (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="enableAIChat">{t("settings.server.aiChat.label")}</Label>
              <Switch
                id="enableAIChat"
                checked={enableAIChat}
                onCheckedChange={handleAIChatToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="enablePush">{t("settings.server.push.label")}</Label>
              <Switch
                id="enablePush"
                checked={enablePush}
                onCheckedChange={handlePushToggle}
              />
            </div>
          </>
        )}
        
        {!serverUrl && (
          <p className="text-sm text-muted-foreground">
            {t("settings.server.notConfigured")}
          </p>
        )}
      </div>
    </SettingsSection>
  )
}
```

### 6. Server Status Indicator

**Location:** `src/app/components/server-status-indicator.tsx`

**Purpose:** Visual indicator of server connection status

```typescript
import { useState, useEffect } from "react"
import { co } from "jazz-tools"
import { isServerAvailable, getServerUrl } from "#app/lib/api-client-with-fallback"
import type { UserAccount } from "#shared/schema/user"

export { ServerStatusIndicator }

type Status = "connected" | "disconnected" | "not-configured" | "checking"

type Props = {
  me: co.loaded<typeof UserAccount> | null
}

function ServerStatusIndicator({ me }: Props) {
  let [status, setStatus] = useState<Status>("checking")
  let serverUrl = getServerUrl(me)
  
  useEffect(() => {
    if (!serverUrl) {
      setStatus("not-configured")
      return
    }
    
    setStatus("checking")
    
    isServerAvailable(serverUrl).then(available => {
      setStatus(available ? "connected" : "disconnected")
    })
  }, [serverUrl])
  
  let colors = {
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    "not-configured": "bg-gray-400",
    checking: "bg-yellow-500 animate-pulse",
  }
  
  let labels = {
    connected: "Server connected",
    disconnected: "Server disconnected",
    "not-configured": "Server not configured",
    checking: "Checking connection...",
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
      <span className="text-sm text-muted-foreground">{labels[status]}</span>
    </div>
  )
}
```

### 7. Updated Astro Configuration

**Location:** `astro.config.ts`

**Changes:** Support both static and server output modes

```typescript
import { defineConfig, envField } from "astro/config"

// Determine output mode from environment
let outputMode = process.env.ASTRO_OUTPUT || "server"
let isStatic = outputMode === "static"

// Only import adapter for server mode
let adapter = isStatic ? undefined : await getAdapter()

async function getAdapter() {
  if (process.env.ASTRO_ADAPTER === "node") {
    let { default: node } = await import("@astrojs/node")
    return node({ mode: "standalone" })
  }
  let { default: vercel } = await import("@astrojs/vercel")
  return vercel()
}

export default defineConfig({
  output: isStatic ? "static" : "server",
  adapter,
  
  env: {
    schema: {
      // Server variables - optional in static mode
      GOOGLE_AI_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: isStatic,
      }),
      VAPID_PRIVATE_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: isStatic,
      }),
      CRON_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: isStatic,
      }),
      JAZZ_WORKER_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: isStatic,
      }),
      
      // New: Public server URL for static builds
      PUBLIC_SERVER_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      
      // Existing public variables (always required)
      PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_JAZZ_SYNC_SERVER: envField.string({
        context: "client",
        access: "public",
      }),
      // ... other existing vars ...
    },
  },
  
  // ... rest of config ...
})
```

### 8. GitHub Pages Deployment Workflow

**Location:** `.github/workflows/deploy-pages.yml`

**Purpose:** CI/CD for static deployment to GitHub Pages

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
          
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          
      - run: pnpm install --frozen-lockfile
      
      - name: Build static site
        run: pnpm build:static
        env:
          PUBLIC_JAZZ_SYNC_SERVER: ${{ vars.PUBLIC_JAZZ_SYNC_SERVER }}
          PUBLIC_SERVER_URL: ${{ vars.PUBLIC_SERVER_URL }}
          
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 9. Updated Package Scripts

**Location:** `package.json`

**Changes:** Add static build scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "pnpm test:run && astro check && astro build",
    "build:static": "ASTRO_OUTPUT=static astro check && ASTRO_OUTPUT=static astro build",
    "build:node": "ASTRO_ADAPTER=node astro check && ASTRO_ADAPTER=node astro build",
    "preview": "astro preview",
    "preview:static": "pnpm build:static && npx serve dist"
  }
}
```

## Data Models

### ServerSettings Schema

```typescript
let ServerSettings = co.map({
  // URL of the server providing AI chat and push notifications
  serverUrl: z.string().optional(),
  
  // Whether AI chat is enabled (default: true if server configured)
  enableAIChat: z.boolean().optional(),
  
  // Whether push notifications are enabled (default: true if server configured)
  enablePushNotifications: z.boolean().optional(),
  
  // Optional user-provided API key for AI services
  apiKey: z.string().optional(),
})
```

### Updated UserAccountRoot

```typescript
let UserAccountRoot = co.map({
  people: co.list(Person),
  notificationSettings: NotificationSettings.optional(),
  usageTracking: UsageTracking.optional(),
  language: z.enum(["de", "en"]).optional(),
  serverSettings: ServerSettings.optional(), // NEW
})
```

## Error Handling

### Server Unavailable

```typescript
// In assistant route
function AssistantScreen() {
  let { me } = useAccount(UserAccount)
  let aiAvailable = hasAIChat(me)
  
  if (!aiAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>{t("assistant.serverNotConfigured")}</p>
        <Link to="/settings">
          <Button>{t("assistant.configureServer")}</Button>
        </Link>
      </div>
    )
  }
  
  // ... normal chat UI ...
}
```

### API Request Failures

```typescript
// In API client
async function callChatAPI(messages: unknown[]) {
  let client = createApiClient(me)
  
  if (!client.isConfigured) {
    return { error: "Server not configured" }
  }
  
  let result = await tryCatch(client.chat(messages))
  
  if (!result.ok) {
    return { error: result.error.message }
  }
  
  return { data: result.value }
}
```

## Testing Strategy

### Unit Tests

1. **Feature Detection**
   - Test hasServerFeatures with/without settings
   - Test hasAIChat with various configurations
   - Test hasPushNotifications with browser support checks

2. **API Client**
   - Test getServerUrl priority (settings > env)
   - Test isServerAvailable with mock responses
   - Test createApiClient methods

3. **Server Settings Component**
   - Test URL input updates settings
   - Test toggle switches update settings
   - Test connection test button

### Integration Tests

1. **Static Build**
   - Test build succeeds without server vars
   - Test app loads in static mode
   - Test Jazz sync works in static mode

2. **Server Build**
   - Test build succeeds with server vars
   - Test API routes work
   - Test full feature set available

### Manual Testing Checklist

- [ ] Static build completes without server vars
- [ ] App loads on GitHub Pages
- [ ] Jazz sync works in static mode
- [ ] Server settings UI appears in settings
- [ ] Server URL can be configured
- [ ] Connection test works
- [ ] AI chat shows/hides based on config
- [ ] Push notifications show/hide based on config
- [ ] Server build still works with all features
- [ ] Vercel deployment works as before

## Migration Considerations

### No Breaking Changes

This refactoring is additive:
- Existing server deployments continue to work unchanged
- New static deployment option is opt-in
- User settings are optional (defaults work)

### Gradual Rollout

1. Add server settings schema (no UI impact)
2. Add feature detection (no UI impact)
3. Add API client abstraction (internal change)
4. Add settings UI (new feature)
5. Update build configuration (new option)
6. Add GitHub Pages workflow (new deployment)

## Security Considerations

### API Key Storage

- User-provided API keys stored in Jazz (encrypted)
- Keys never sent to Jazz sync server in plaintext
- Keys only used client-side for direct API calls

### Server URL Validation

- Validate URL format before saving
- Only allow HTTPS URLs in production
- Sanitize URL before use in fetch calls

## Performance Considerations

### Static Build Benefits

- Faster initial load (no SSR)
- Better caching (static assets)
- Lower hosting costs (no server)
- Works on any static host

### Feature Detection Caching

- Cache feature status in component state
- Only re-check on settings change
- Avoid repeated server health checks

## Conclusion

This design enables Tilly to work as a fully local-first app deployable to GitHub Pages while maintaining the option for users to configure server features. The architecture is additive and maintains full backward compatibility with existing server deployments.

Key benefits:
- Deploy anywhere (GitHub Pages, Vercel, self-hosted)
- Works offline by default
- Server features are opt-in
- User controls their own server configuration
- No breaking changes for existing users

