# Design Document

## Overview

This design document outlines the approach for reorganizing the Tilly codebase from a flat file structure to a domain-driven architecture. The refactoring consists of three phases: cleaning up auth migration debt, reorganizing feature files by domain, and reorganizing tool files by domain.

## Architecture

### Current Structure

```
src/app/features/           # 23 files, flat structure
├── assistant-message-components.tsx
├── auth-prompt.tsx
├── data-download-button.tsx
├── data-file-schema.ts
├── data-upload-button.tsx
├── new-note.tsx
├── new-person.tsx
├── new-reminder.tsx
├── note-form.tsx
├── note-hooks.ts
├── note-list-item.tsx
├── note-tour.tsx
├── notification-settings.tsx
├── person-details.tsx
├── person-form.tsx
├── person-hooks.ts
├── person-list-item.tsx
├── person-tour.tsx
├── reminder-form.tsx
├── reminder-hooks.ts
├── reminder-list-item.tsx
├── reminder-tour.tsx
└── server-settings.tsx

src/shared/tools/           # 20 files, flat structure
├── note-create-ui.tsx
├── note-create.ts
├── note-update-ui.tsx
├── note-update.ts
├── person-create-ui.tsx
├── person-create.ts
├── person-read-ui.tsx
├── person-read.ts
├── person-update-ui.tsx
├── person-update.ts
├── reminder-create-ui.tsx
├── reminder-create.ts
├── reminder-read-ui.tsx
├── reminder-read.ts
├── reminder-update-ui.tsx
├── reminder-update.ts
├── tools.ts
├── ui.tsx
├── user-question-ui.tsx
└── user-question.ts
```

### Target Structure

```
src/app/features/
├── people/
│   ├── details.tsx         (was person-details.tsx)
│   ├── form.tsx            (was person-form.tsx)
│   ├── hooks.ts            (was person-hooks.ts)
│   ├── list-item.tsx       (was person-list-item.tsx)
│   ├── new.tsx             (was new-person.tsx)
│   └── tour.tsx            (was person-tour.tsx)
├── notes/
│   ├── form.tsx            (was note-form.tsx)
│   ├── hooks.ts            (was note-hooks.ts)
│   ├── list-item.tsx       (was note-list-item.tsx)
│   ├── new.tsx             (was new-note.tsx)
│   └── tour.tsx            (was note-tour.tsx)
├── reminders/
│   ├── form.tsx            (was reminder-form.tsx)
│   ├── hooks.ts            (was reminder-hooks.ts)
│   ├── list-item.tsx       (was reminder-list-item.tsx)
│   ├── new.tsx             (was new-reminder.tsx)
│   └── tour.tsx            (was reminder-tour.tsx)
├── shared/
│   ├── data-download-button.tsx
│   ├── data-file-schema.ts
│   ├── data-upload-button.tsx
│   └── notification-settings.tsx
├── assistant-message-components.tsx  (stays - cross-domain)
├── auth-prompt.tsx                   (stays - cross-domain)
└── server-settings.tsx               (stays - cross-domain)

src/shared/tools/
├── people/
│   ├── create.ts           (was person-create.ts)
│   ├── create-ui.tsx       (was person-create-ui.tsx)
│   ├── read.ts             (was person-read.ts)
│   ├── read-ui.tsx         (was person-read-ui.tsx)
│   ├── update.ts           (was person-update.ts)
│   └── update-ui.tsx       (was person-update-ui.tsx)
├── notes/
│   ├── create.ts           (was note-create.ts)
│   ├── create-ui.tsx       (was note-create-ui.tsx)
│   ├── update.ts           (was note-update.ts)
│   └── update-ui.tsx       (was note-update-ui.tsx)
├── reminders/
│   ├── create.ts           (was reminder-create.ts)
│   ├── create-ui.tsx       (was reminder-create-ui.tsx)
│   ├── read.ts             (was reminder-read.ts)
│   ├── read-ui.tsx         (was reminder-read-ui.tsx)
│   ├── update.ts           (was reminder-update.ts)
│   └── update-ui.tsx       (was reminder-update-ui.tsx)
├── system/
│   ├── user-question.ts
│   └── user-question-ui.tsx
├── tools.ts                (updated imports)
└── ui.tsx                  (updated imports)
```

## Components and Interfaces

### Phase 1: Auth Migration Debt Cleanup

#### auth-utils.ts Cleanup

**Current State:**
- Contains commented-out Clerk imports and functions
- Has stub functions `getSignInUrl` and `getSignUpUrl` that return `/app`
- TODO comment at top

**Target State:**
- Remove the file entirely if stubs are not needed
- OR keep only the stub functions without comments if they're still referenced

**Call Sites to Check:**
- `src/app/components/status-indicator.tsx` - uses `getSignInUrl`

#### status-indicator.tsx Cleanup

**Current State:**
```typescript
// TODO: Replace with Jazz auth in task 2
// import { useAuth } from "#shared/clerk/client"
let isLoaded = true
let isSignedIn = true // Temporary - will be replaced with passkey auth
```

**Target State:**
- Remove TODO comments
- Either implement Jazz auth check OR document the hardcoded values as intentional
- The `NotSignedInIndicator` component may need to be removed or updated

#### push-cron.ts Cleanup

**Current State:**
- Large commented-out code blocks for `getUsersWithJazz` iteration
- Multiple `eslint-disable` comments for unused variables
- Disabled `loadNotificationSettings` function in comments

**Target State:**
- Move to `src/server/features/_archived/push-cron.ts` if feature is disabled
- OR remove all commented code and keep only active logic with clear documentation

### Phase 2: Feature Directory Reorganization

#### Import Path Mapping

| Old Path | New Path |
|----------|----------|
| `#app/features/person-details` | `#app/features/people/details` |
| `#app/features/person-form` | `#app/features/people/form` |
| `#app/features/person-hooks` | `#app/features/people/hooks` |
| `#app/features/person-list-item` | `#app/features/people/list-item` |
| `#app/features/new-person` | `#app/features/people/new` |
| `#app/features/person-tour` | `#app/features/people/tour` |
| `#app/features/note-form` | `#app/features/notes/form` |
| `#app/features/note-hooks` | `#app/features/notes/hooks` |
| `#app/features/note-list-item` | `#app/features/notes/list-item` |
| `#app/features/new-note` | `#app/features/notes/new` |
| `#app/features/note-tour` | `#app/features/notes/tour` |
| `#app/features/reminder-form` | `#app/features/reminders/form` |
| `#app/features/reminder-hooks` | `#app/features/reminders/hooks` |
| `#app/features/reminder-list-item` | `#app/features/reminders/list-item` |
| `#app/features/new-reminder` | `#app/features/reminders/new` |
| `#app/features/reminder-tour` | `#app/features/reminders/tour` |
| `#app/features/data-file-schema` | `#app/features/shared/data-file-schema` |
| `#app/features/data-download-button` | `#app/features/shared/data-download-button` |
| `#app/features/data-upload-button` | `#app/features/shared/data-upload-button` |
| `#app/features/notification-settings` | `#app/features/shared/notification-settings` |

#### Files Requiring Import Updates

**Route Files:**
- `src/app/routes/_app.people.index.tsx` - People imports
- `src/app/routes/_app.people.$personID.tsx` - People, Notes, Reminders imports
- `src/app/routes/_app.reminders.tsx` - Reminders imports
- `src/app/routes/_app.settings.tsx` - Shared imports
- `src/app/routes/_app.assistant.tsx` - Assistant imports
- `src/app/routes/tour.tsx` - Tour imports

**Feature Files (internal cross-references):**
- `src/app/features/new-note.tsx` → `notes/new.tsx` - imports `note-form`
- `src/app/features/new-person.tsx` → `people/new.tsx` - imports `person-form`
- `src/app/features/new-reminder.tsx` → `reminders/new.tsx` - imports `reminder-form`
- `src/app/features/reminder-list-item.tsx` → `reminders/list-item.tsx` - imports `note-form`
- `src/app/features/person-tour.tsx` → `people/tour.tsx` - imports `new-person`
- `src/app/features/note-tour.tsx` → `notes/tour.tsx` - imports `new-note`, `new-person`
- `src/app/features/reminder-tour.tsx` → `reminders/tour.tsx` - imports `new-reminder`, `new-person`
- `src/app/features/data-download-button.tsx` → `shared/data-download-button.tsx` - imports `data-file-schema`

### Phase 3: Tool Directory Reorganization

#### Import Path Mapping for tools.ts

| Old Import | New Import |
|------------|------------|
| `./person-read` | `./people/read` |
| `./person-create` | `./people/create` |
| `./person-update` | `./people/update` |
| `./note-create` | `./notes/create` |
| `./note-update` | `./notes/update` |
| `./reminder-read` | `./reminders/read` |
| `./reminder-create` | `./reminders/create` |
| `./reminder-update` | `./reminders/update` |
| `./user-question` | `./system/user-question` |

#### Import Path Mapping for ui.tsx

| Old Import | New Import |
|------------|------------|
| `./person-create-ui` | `./people/create-ui` |
| `./person-update-ui` | `./people/update-ui` |
| `./person-read-ui` | `./people/read-ui` |
| `./note-create-ui` | `./notes/create-ui` |
| `./note-update-ui` | `./notes/update-ui` |
| `./reminder-create-ui` | `./reminders/create-ui` |
| `./reminder-update-ui` | `./reminders/update-ui` |
| `./reminder-read-ui` | `./reminders/read-ui` |
| `./user-question-ui` | `./system/user-question-ui` |

## Data Models

No data model changes are required. This refactoring only affects file organization and import paths.

## Error Handling

### Build Verification

After each phase, run:
1. `pnpm check` - TypeScript compilation
2. `pnpm build` - Production build
3. `pnpm test` - Unit tests

### Rollback Strategy

If issues are discovered:
1. Git revert the specific phase commit
2. Re-run verification commands
3. Address issues before re-attempting

## Testing Strategy

### Automated Testing

1. **TypeScript Compilation** (`pnpm check`)
   - Verifies all import paths resolve correctly
   - Catches missing exports or type mismatches

2. **Unit Tests** (`pnpm test`)
   - Existing tests should pass without modification
   - Tests verify component behavior is unchanged

3. **Build Verification** (`pnpm build`)
   - Ensures production bundle generates correctly
   - Catches any bundler-specific issues

### Manual Smoke Testing

After all phases complete:
1. Start the app (`pnpm dev`)
2. Navigate to People list - verify list renders
3. Create a new Person - verify form works
4. Add a Note to a Person - verify note creation
5. Add a Reminder to a Person - verify reminder creation
6. Open Assistant - verify AI tools still work
7. Check Settings page - verify data export/import works

## Migration Notes

### File Movement Strategy

Use `git mv` for all file movements to preserve git history:

```bash
# Example for people domain
git mv src/app/features/person-details.tsx src/app/features/people/details.tsx
```

### Import Update Strategy

Use find-and-replace across the codebase:

```bash
# Example pattern
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/#app\/features\/person-details/#app\/features\/people\/details/g'
```

### Verification Between Phases

Run `pnpm check` after each phase to catch issues early before proceeding to the next phase.
