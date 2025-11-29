# Implementation Plan

- [x] 1. Create Server Settings Schema
  - [x] 1.1 Create `src/shared/schema/server-settings.ts` file
    - Define ServerSettings CoMap with serverUrl, enableAIChat, enablePushNotifications, apiKey fields
    - Export ServerSettings type
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 1.2 Update `src/shared/schema/user.ts` to add serverSettings field
    - Import ServerSettings from server-settings.ts
    - Add serverSettings field to UserAccountRoot as optional
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 2. Create Feature Detection Module
  - [x] 2.1 Create `src/app/lib/feature-detection.ts` file
    - Implement hasServerFeatures() function
    - Implement hasAIChat() function
    - Implement hasPushNotifications() function
    - Implement getFeatureStatus() function
    - Check user settings first, then fall back to env vars
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 3. Create API Client with Fallback
  - [x] 3.1 Create `src/app/lib/api-client-with-fallback.ts` file
    - Implement getServerUrl() function (settings priority over env)
    - Implement isServerAvailable() health check function
    - Implement createApiClient() factory function
    - Add chat() method with error handling
    - Add testConnection() method
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. Add Server Settings UI
  - [x] 4.1 Create `src/app/features/server-settings.tsx` component
    - Add server URL input field
    - Add connection test button with status display
    - Add AI chat enable/disable toggle
    - Add push notifications enable/disable toggle
    - Show "not configured" message when no URL
    - _Requirements: 3.1, 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 4.2 Add server settings translations to `src/shared/intl/messages.settings.ts`
    - Add settings.server.title, description, url.label
    - Add settings.server.test, connected, connectionFailed
    - Add settings.server.aiChat.label, push.label
    - Add settings.server.notConfigured message
    - _Requirements: 3.1_
  - [x] 4.3 Update `src/app/routes/_app.settings.tsx` to include ServerSettingsSection
    - Import ServerSettingsSection component
    - Add to settings page after notification settings
    - Pass me prop with serverSettings resolved
    - _Requirements: 3.1_

- [x] 5. Create Server Status Indicator
  - [x] 5.1 Create `src/app/components/server-status-indicator.tsx` component
    - Show green dot when connected
    - Show red dot when disconnected
    - Show gray dot when not configured
    - Show yellow pulsing dot when checking
    - Display status label text
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Make AI Chat Feature Optional
  - [x] 6.1 Update `src/app/routes/_app.assistant.tsx`
    - Import hasAIChat from feature-detection
    - Check if AI chat is available before rendering chat UI
    - Show configuration prompt when AI chat unavailable
    - Add link to settings page for configuration
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 6.2 Update chat API client to use configurable server URL
    - Import getServerUrl from api-client-with-fallback
    - Use server URL from settings or env var
    - Handle missing server URL gracefully
    - _Requirements: 4.3, 5.1_

- [x] 7. Make Push Notifications Optional
  - [x] 7.1 Update `src/app/features/notification-settings.tsx`
    - Import hasPushNotifications from feature-detection
    - Check if push notifications are available
    - Show configuration prompt when unavailable
    - Hide notification settings when server not configured
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8. Update Astro Configuration for Static Build
  - [x] 8.1 Modify `astro.config.ts` for dual output modes
    - Add ASTRO_OUTPUT environment variable check
    - Conditionally set output to "static" or "server"
    - Conditionally include adapter only for server mode
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 8.2 Make server environment variables optional
    - Add optional: true for GOOGLE_AI_API_KEY in static mode
    - Add optional: true for VAPID_PRIVATE_KEY in static mode
    - Add optional: true for CRON_SECRET in static mode
    - Add optional: true for JAZZ_WORKER_SECRET in static mode
    - Add PUBLIC_SERVER_URL as new optional public variable
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 9. Update Package Scripts
  - [x] 9.1 Add static build scripts to `package.json`
    - Add build:static script with ASTRO_OUTPUT=static
    - Add preview:static script for local testing
    - Keep existing build and build:node scripts unchanged
    - _Requirements: 1.1, 10.1, 10.2_

- [x] 10. Add GitHub Pages Deployment
  - [x] 10.1 Create `.github/workflows/deploy-pages.yml` workflow
    - Configure trigger on push to main branch
    - Set up pnpm and Node.js
    - Run build:static command
    - Upload dist folder as pages artifact
    - Deploy to GitHub Pages
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [x] 10.2 Add GitHub Pages base path support to astro.config.ts
    - Add site configuration for GitHub Pages URL
    - Add base path configuration from env var
    - _Requirements: 9.4_

- [x] 11. Update Middleware for Static Compatibility
  - [x] 11.1 Update `src/middleware.ts` for client-side routing
    - Check if running in static mode
    - Skip server-only redirects in static mode
    - Keep locale detection for client-side use
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 12. Add 404 Handling for GitHub Pages
  - [x] 12.1 Create 404.html for SPA fallback
    - Create public/404.html that redirects to index
    - Handle client-side routing on 404
    - _Requirements: 8.2_

- [ ] 13. Update Documentation
  - [ ] 13.1 Update README.md with deployment options
    - Add "Deployment Options" section
    - Document GitHub Pages deployment
    - Document self-hosting with server features
    - Document hybrid approach
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 13.2 Create `docs/STATIC_DEPLOYMENT.md` guide
    - Step-by-step GitHub Pages deployment
    - Environment variable configuration
    - Troubleshooting common issues
    - _Requirements: 12.2, 12.5_
  - [ ] 13.3 Create `docs/SERVER_CONFIGURATION.md` guide
    - How to deploy server separately
    - How to configure server URL in app settings
    - How to use bring-your-own-key for AI
    - Push notification setup with custom server
    - _Requirements: 12.3, 12.4_

- [x] 14. Write unit tests for feature detection
  - Test hasServerFeatures with/without settings
  - Test hasAIChat with various configurations
  - Test hasPushNotifications with browser support
  - Test getFeatureStatus returns correct status
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 15. Write unit tests for API client
  - Test getServerUrl priority (settings > env)
  - Test isServerAvailable with mock responses
  - Test createApiClient methods
  - Test error handling for missing server
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 16. Write integration tests for static build
  - Test build succeeds without server vars
  - Test app loads in static mode
  - Test Jazz sync works in static mode
  - Test feature detection works correctly
  - _Requirements: 1.1, 1.2, 1.3, 2.5_

- [x] 17. Verify backward compatibility
  - Run existing server build
  - Verify all server features work
  - Verify Vercel deployment works
  - Verify Node adapter deployment works
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 18. Manual testing
  - Test static build completes without server vars
  - Test app loads on local static server
  - Test Jazz sync works in static mode
  - Test server settings UI in settings page
  - Test server URL configuration and connection test
  - Test AI chat shows/hides based on config
  - Test push notifications show/hide based on config
  - Test server build still works with all features
  - _Requirements: 1.1, 3.1, 5.1, 6.1, 7.1, 10.1_

