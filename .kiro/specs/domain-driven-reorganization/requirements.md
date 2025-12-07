# Requirements Document

## Introduction

This specification defines the requirements for reorganizing the Tilly codebase from a flat file structure to a domain-driven architecture. The refactoring addresses two main concerns: cleaning up technical debt from the Clerk-to-Passkey authentication migration, and restructuring feature and tool directories by domain (People, Notes, Reminders) to improve maintainability and reduce cognitive load.

## Glossary

- **Domain**: A logical grouping of related functionality (e.g., People, Notes, Reminders)
- **Feature Module**: A React component and its associated hooks, forms, and utilities in `src/app/features/`
- **Tool Module**: An AI tool definition and its UI component in `src/shared/tools/`
- **Auth Migration Debt**: Commented-out code and TODOs remaining from the Clerk-to-Passkey authentication migration
- **Flat Folder Syndrome**: An organizational anti-pattern where all files exist at the same directory level regardless of domain

## Requirements

### Requirement 1: Clean Auth Migration Debt in auth-utils.ts

**User Story:** As a developer, I want the auth-utils.ts file to contain only active code, so that I can understand the current authentication implementation without confusion from legacy Clerk references.

#### Acceptance Criteria

1. WHEN the Developer opens `src/app/lib/auth-utils.ts`, THE System SHALL display only active, uncommented code with no Clerk-related comments or disabled code blocks.
2. IF the stub functions `getSignInUrl` and `getSignUpUrl` are no longer needed by any call site, THEN THE System SHALL have those functions removed and call sites updated to link directly to `/app` or `/settings`.
3. WHEN the Developer searches for "Clerk" in `src/app/lib/auth-utils.ts`, THE System SHALL return zero matches.

### Requirement 2: Clean Auth Migration Debt in status-indicator.tsx

**User Story:** As a developer, I want the status-indicator.tsx file to use the current authentication system without TODO comments, so that the authentication state is clearly implemented.

#### Acceptance Criteria

1. WHEN the Developer opens `src/app/components/status-indicator.tsx`, THE System SHALL display authentication logic using Jazz passkey auth or a clear temporary implementation without TODO comments referencing Clerk.
2. THE System SHALL have the `isSignedIn` variable derive its value from the actual authentication state or be clearly documented as intentionally hardcoded.
3. WHEN the Developer searches for "TODO" in `src/app/components/status-indicator.tsx`, THE System SHALL return zero matches related to authentication replacement.

### Requirement 3: Clean Auth Migration Debt in push-cron.ts

**User Story:** As a developer, I want the push-cron.ts file to contain only active notification delivery logic, so that I can understand and maintain the cron job without wading through disabled code.

#### Acceptance Criteria

1. WHEN the Developer opens `src/server/features/push-cron.ts`, THE System SHALL display only active, uncommented code with no large disabled code blocks.
2. IF the notification delivery feature is currently disabled, THEN THE System SHALL have the file moved to `src/server/features/_archived/` or contain only a minimal stub with clear documentation.
3. THE System SHALL have all `eslint-disable` comments for unused variables removed along with the unused code they reference.

### Requirement 4: Create Domain Directory Structure for Features

**User Story:** As a developer, I want feature files organized by domain, so that I can quickly locate all files related to a specific feature area.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/app/features/`, THE System SHALL display domain subdirectories: `people/`, `notes/`, `reminders/`, and `shared/`.
2. THE System SHALL have each domain directory contain only files related to that domain.
3. THE System SHALL have the `shared/` directory contain cross-domain utilities like `data-file-schema.ts`, `data-download-button.tsx`, and `data-upload-button.tsx`.

### Requirement 5: Reorganize People Feature Files

**User Story:** As a developer, I want all People-related feature files in a single directory, so that I can work on the People feature without filtering through unrelated files.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/app/features/people/`, THE System SHALL display files: `form.tsx`, `hooks.ts`, `list-item.tsx`, `details.tsx`, `tour.tsx`, and `new.tsx`.
2. THE System SHALL have all imports in route files (`src/app/routes/_app.people.*`) updated to reference the new paths.
3. WHEN the Developer runs `pnpm check`, THE System SHALL report zero TypeScript errors related to People feature imports.

### Requirement 6: Reorganize Notes Feature Files

**User Story:** As a developer, I want all Notes-related feature files in a single directory, so that I can work on the Notes feature without filtering through unrelated files.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/app/features/notes/`, THE System SHALL display files: `form.tsx`, `hooks.ts`, `list-item.tsx`, `tour.tsx`, and `new.tsx`.
2. THE System SHALL have all imports in consuming files updated to reference the new paths.
3. WHEN the Developer runs `pnpm check`, THE System SHALL report zero TypeScript errors related to Notes feature imports.

### Requirement 7: Reorganize Reminders Feature Files

**User Story:** As a developer, I want all Reminders-related feature files in a single directory, so that I can work on the Reminders feature without filtering through unrelated files.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/app/features/reminders/`, THE System SHALL display files: `form.tsx`, `hooks.ts`, `list-item.tsx`, `tour.tsx`, and `new.tsx`.
2. THE System SHALL have all imports in route files (`src/app/routes/_app.reminders.*`) updated to reference the new paths.
3. WHEN the Developer runs `pnpm check`, THE System SHALL report zero TypeScript errors related to Reminders feature imports.

### Requirement 8: Create Domain Directory Structure for Tools

**User Story:** As a developer, I want AI tool files organized by domain, so that I can quickly locate tool definitions and their UI components for a specific feature area.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/shared/tools/`, THE System SHALL display domain subdirectories: `people/`, `notes/`, `reminders/`, and `system/`.
2. THE System SHALL have each domain directory contain the tool definition (`.ts`) and UI component (`-ui.tsx`) files for that domain.
3. THE System SHALL have the `system/` directory contain the `user-question.ts` and `user-question-ui.tsx` files.

### Requirement 9: Reorganize People Tool Files

**User Story:** As a developer, I want all People-related tool files in a single directory, so that I can work on People AI tools without filtering through unrelated files.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/shared/tools/people/`, THE System SHALL display files: `create.ts`, `create-ui.tsx`, `read.ts`, `read-ui.tsx`, `update.ts`, and `update-ui.tsx`.
2. THE System SHALL have the central exports in `src/shared/tools/tools.ts` updated to reference the new paths.
3. WHEN the Developer runs `pnpm check`, THE System SHALL report zero TypeScript errors related to People tool imports.

### Requirement 10: Reorganize Notes Tool Files

**User Story:** As a developer, I want all Notes-related tool files in a single directory, so that I can work on Notes AI tools without filtering through unrelated files.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/shared/tools/notes/`, THE System SHALL display files: `create.ts`, `create-ui.tsx`, `update.ts`, and `update-ui.tsx`.
2. THE System SHALL have the central exports in `src/shared/tools/tools.ts` updated to reference the new paths.
3. WHEN the Developer runs `pnpm check`, THE System SHALL report zero TypeScript errors related to Notes tool imports.

### Requirement 11: Reorganize Reminders Tool Files

**User Story:** As a developer, I want all Reminders-related tool files in a single directory, so that I can work on Reminders AI tools without filtering through unrelated files.

#### Acceptance Criteria

1. WHEN the Developer navigates to `src/shared/tools/reminders/`, THE System SHALL display files: `create.ts`, `create-ui.tsx`, `read.ts`, `read-ui.tsx`, `update.ts`, and `update-ui.tsx`.
2. THE System SHALL have the central exports in `src/shared/tools/tools.ts` updated to reference the new paths.
3. WHEN the Developer runs `pnpm check`, THE System SHALL report zero TypeScript errors related to Reminders tool imports.

### Requirement 12: Update Central Tool Exports

**User Story:** As a developer, I want the central tool exports to remain stable after reorganization, so that consuming code continues to work without changes.

#### Acceptance Criteria

1. THE System SHALL have `src/shared/tools/tools.ts` export all tool definitions from their new domain paths.
2. THE System SHALL have `src/shared/tools/ui.tsx` export all tool UI components from their new domain paths.
3. WHEN the Developer imports from `#shared/tools/tools` or `#shared/tools/ui`, THE System SHALL resolve to the same exports as before reorganization.

### Requirement 13: Verify Build Integrity

**User Story:** As a developer, I want the codebase to build successfully after reorganization, so that I can deploy with confidence.

#### Acceptance Criteria

1. WHEN the Developer runs `pnpm check`, THE System SHALL complete with zero errors.
2. WHEN the Developer runs `pnpm build`, THE System SHALL complete successfully.
3. WHEN the Developer runs `pnpm test`, THE System SHALL have all existing tests pass.
