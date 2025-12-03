# Requirements Document

## Introduction

This specification defines the requirements for refactoring the Tilly application to support local-first operation with optional server features. The goal is to enable deployment to static hosting platforms like GitHub Pages while allowing users who self-host to optionally configure server features (AI chat, push notifications) through the settings UI.

## Glossary

- **Tilly Application**: The relationship management PWA being refactored
- **Local-First**: Architecture where the app works fully offline with data stored client-side
- **Static Site Generation (SSG)**: Build output that produces static HTML/JS/CSS files
- **Server Features**: Optional functionality requiring a backend (AI chat, push notifications, cron jobs)
- **Jazz**: Local-first sync framework already used for data storage
- **Server URL**: User-configurable endpoint for optional server features
- **GitHub Pages**: Static hosting platform for deployment target

## Requirements

### Requirement 1: Support Static Site Generation

**User Story:** As a developer, I want to build the app as a static site, so that I can deploy to GitHub Pages without server infrastructure.

#### Acceptance Criteria

1. WHEN the static build command is run, THE Tilly Application SHALL generate static HTML/JS/CSS output
2. WHEN deployed to GitHub Pages, THE Tilly Application SHALL load and function without server-side rendering
3. WHEN the static build is complete, THE Tilly Application SHALL NOT require Node.js runtime for serving
4. WHERE server environment variables are missing, THE Tilly Application SHALL build successfully with server features disabled

### Requirement 2: Make Server Environment Variables Optional

**User Story:** As a developer, I want server-related environment variables to be optional, so that the app can build without server configuration.

#### Acceptance Criteria

1. WHEN GOOGLE_AI_API_KEY is not set, THE Tilly Application SHALL build successfully with AI chat disabled
2. WHEN VAPID_PRIVATE_KEY is not set, THE Tilly Application SHALL build successfully with push notifications disabled
3. WHEN CRON_SECRET is not set, THE Tilly Application SHALL build successfully with cron jobs disabled
4. WHEN JAZZ_WORKER_SECRET is not set, THE Tilly Application SHALL build successfully with server worker disabled
5. WHEN all server variables are missing, THE Tilly Application SHALL function as a local-only app

### Requirement 3: Add Server Settings Schema

**User Story:** As a user, I want to configure server features in settings, so that I can connect to my own server or a hosted service.

#### Acceptance Criteria

1. WHEN a user opens settings, THE Tilly Application SHALL display a Server Features configuration section
2. WHEN a user enters a server URL, THE Tilly Application SHALL store it in their Jazz account root
3. WHEN a user enables AI chat, THE Tilly Application SHALL store the preference in their account
4. WHEN a user enables push notifications, THE Tilly Application SHALL store the preference in their account
5. WHERE a user provides an API key, THE Tilly Application SHALL store it securely in their account

### Requirement 4: Create API Client with Server Fallback

**User Story:** As a user, I want the app to gracefully handle missing server features, so that I can use core functionality without a server.

#### Acceptance Criteria

1. WHEN the server URL is not configured, THE Tilly Application SHALL disable server-dependent features
2. WHEN the server is unreachable, THE Tilly Application SHALL show a connection error message
3. WHEN making API requests, THE Tilly Application SHALL use the user-configured server URL
4. WHEN server features are disabled, THE Tilly Application SHALL hide related UI elements
5. WHERE the server becomes available, THE Tilly Application SHALL re-enable server features

### Requirement 5: Make AI Chat Feature Optional

**User Story:** As a user, I want to use the app without AI chat, so that I can manage relationships without server dependency.

#### Acceptance Criteria

1. WHEN server URL is not configured, THE Tilly Application SHALL hide the AI chat interface
2. WHEN server URL is configured, THE Tilly Application SHALL show the AI chat interface
3. WHEN AI chat is disabled in settings, THE Tilly Application SHALL hide the chat feature
4. WHEN the chat API fails, THE Tilly Application SHALL display a helpful error message
5. WHERE AI chat is unavailable, THE Tilly Application SHALL show a configuration prompt in settings

### Requirement 6: Make Push Notifications Optional

**User Story:** As a user, I want push notifications to be optional, so that I can use the app without server-side notification delivery.

#### Acceptance Criteria

1. WHEN server URL is not configured, THE Tilly Application SHALL disable push notification registration
2. WHEN server URL is configured, THE Tilly Application SHALL enable push notification registration
3. WHEN push notifications are disabled, THE Tilly Application SHALL hide the notification settings
4. WHERE push notifications are unavailable, THE Tilly Application SHALL show a configuration prompt
5. WHEN the user has no server configured, THE Tilly Application SHALL suggest local browser reminders as alternative

### Requirement 7: Add Server Status Indicator

**User Story:** As a user, I want to see the server connection status, so that I know which features are available.

#### Acceptance Criteria

1. WHEN viewing settings, THE Tilly Application SHALL display server connection status
2. WHEN the server is connected, THE Tilly Application SHALL show a green status indicator
3. WHEN the server is disconnected, THE Tilly Application SHALL show a red status indicator
4. WHEN the server URL is not configured, THE Tilly Application SHALL show "Not configured" status
5. WHEN clicking the status indicator, THE Tilly Application SHALL test the server connection

### Requirement 8: Update Middleware for Static Compatibility

**User Story:** As a developer, I want the middleware to work in static mode, so that routing functions correctly on GitHub Pages.

#### Acceptance Criteria

1. WHEN running in static mode, THE Tilly Application SHALL handle client-side routing
2. WHEN a 404 occurs on GitHub Pages, THE Tilly Application SHALL redirect to the SPA entry point
3. WHEN the locale redirect is needed, THE Tilly Application SHALL handle it client-side
4. WHEN server middleware is unavailable, THE Tilly Application SHALL function without it

### Requirement 9: Add GitHub Pages Deployment Configuration

**User Story:** As a developer, I want automated deployment to GitHub Pages, so that I can easily publish the static app.

#### Acceptance Criteria

1. WHEN code is pushed to main branch, THE Tilly Application SHALL trigger GitHub Actions workflow
2. WHEN the workflow runs, THE Tilly Application SHALL build the static site
3. WHEN the build succeeds, THE Tilly Application SHALL deploy to GitHub Pages
4. WHEN a base path is configured, THE Tilly Application SHALL use it for asset URLs
5. WHERE deployment fails, THE Tilly Application SHALL report errors in the workflow

### Requirement 10: Maintain Backward Compatibility

**User Story:** As a developer, I want to keep server deployment working, so that users can self-host with full features.

#### Acceptance Criteria

1. WHEN building with server adapter, THE Tilly Application SHALL produce server-side rendered output
2. WHEN all server variables are set, THE Tilly Application SHALL enable all server features
3. WHEN deploying to Vercel, THE Tilly Application SHALL function as before
4. WHEN using Node adapter, THE Tilly Application SHALL support self-hosting
5. WHEN server features are available, THE Tilly Application SHALL use them by default

### Requirement 11: Add Feature Detection

**User Story:** As a developer, I want to detect available features at runtime, so that the UI can adapt accordingly.

#### Acceptance Criteria

1. WHEN the app initializes, THE Tilly Application SHALL detect available server features
2. WHEN checking AI chat availability, THE Tilly Application SHALL consider server URL and settings
3. WHEN checking push notification availability, THE Tilly Application SHALL consider server URL and browser support
4. WHEN features change availability, THE Tilly Application SHALL update the UI accordingly
5. WHERE a feature is unavailable, THE Tilly Application SHALL provide guidance on enabling it

### Requirement 12: Update Documentation

**User Story:** As a developer, I want clear documentation for deployment options, so that I can choose the right approach.

#### Acceptance Criteria

1. WHEN reading the README, THE Tilly Application SHALL explain deployment options
2. WHEN deploying to GitHub Pages, THE Tilly Application SHALL have step-by-step instructions
3. WHEN self-hosting with server features, THE Tilly Application SHALL have configuration guide
4. WHEN configuring server URL in app, THE Tilly Application SHALL have user documentation
5. WHERE issues occur, THE Tilly Application SHALL have troubleshooting guidance
