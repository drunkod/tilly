# Implementation Plan

- [ ] 1. Phase 1: Clean Auth Migration Debt
- [ ] 1.1 Clean auth-utils.ts
  - Remove TODO comment and all commented-out Clerk code
  - Keep stub functions `getSignInUrl` and `getSignUpUrl` if still referenced, otherwise delete file
  - Verify `src/app/components/status-indicator.tsx` still compiles
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 1.2 Clean status-indicator.tsx
  - Remove TODO comments referencing Clerk/Jazz auth replacement
  - Remove commented-out `useAuth` import
  - Add inline comment explaining `isSignedIn = true` is intentional for current auth state
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 1.3 Clean push-cron.ts
  - Remove all commented-out code blocks (the `getUsersWithJazz` iteration, `loadNotificationSettings` function)
  - Remove `eslint-disable` comments for unused variables
  - Remove unused helper functions that were only used by commented code
  - Add brief comment explaining feature is pending Jazz-based user enumeration
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 1.4 Verify Phase 1 completion
  - Run `pnpm check` to ensure no TypeScript errors
  - _Requirements: 13.1_

- [x] 2. Phase 2: Reorganize Feature Files
- [x] 2.1 Create feature domain directories
  - Create `src/app/features/people/`
  - Create `src/app/features/notes/`
  - Create `src/app/features/reminders/`
  - Create `src/app/features/shared/`
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.2 Move People feature files
  - Move `person-details.tsx` to `people/details.tsx`
  - Move `person-form.tsx` to `people/form.tsx`
  - Move `person-hooks.ts` to `people/hooks.ts`
  - Move `person-list-item.tsx` to `people/list-item.tsx`
  - Move `new-person.tsx` to `people/new.tsx`
  - Move `person-tour.tsx` to `people/tour.tsx`
  - _Requirements: 5.1_

- [x] 2.3 Move Notes feature files
  - Move `note-form.tsx` to `notes/form.tsx`
  - Move `note-hooks.ts` to `notes/hooks.ts`
  - Move `note-list-item.tsx` to `notes/list-item.tsx`
  - Move `new-note.tsx` to `notes/new.tsx`
  - Move `note-tour.tsx` to `notes/tour.tsx`
  - _Requirements: 6.1_

- [x] 2.4 Move Reminders feature files
  - Move `reminder-form.tsx` to `reminders/form.tsx`
  - Move `reminder-hooks.ts` to `reminders/hooks.ts`
  - Move `reminder-list-item.tsx` to `reminders/list-item.tsx`
  - Move `new-reminder.tsx` to `reminders/new.tsx`
  - Move `reminder-tour.tsx` to `reminders/tour.tsx`
  - _Requirements: 7.1_

- [x] 2.5 Move Shared feature files
  - Move `data-file-schema.ts` to `shared/data-file-schema.ts`
  - Move `data-download-button.tsx` to `shared/data-download-button.tsx`
  - Move `data-upload-button.tsx` to `shared/data-upload-button.tsx`
  - Move `notification-settings.tsx` to `shared/notification-settings.tsx`
  - _Requirements: 4.3_

- [x] 2.6 Update imports in People domain files
  - Update `people/new.tsx` to import from `#app/features/people/form`
  - Update `people/tour.tsx` to import from `#app/features/people/new`
  - _Requirements: 5.2_

- [x] 2.7 Update imports in Notes domain files
  - Update `notes/new.tsx` to import from `#app/features/notes/form`
  - Update `notes/tour.tsx` to import from `#app/features/notes/new` and `#app/features/people/new`
  - _Requirements: 6.2_

- [x] 2.8 Update imports in Reminders domain files
  - Update `reminders/new.tsx` to import from `#app/features/reminders/form`
  - Update `reminders/list-item.tsx` to import from `#app/features/notes/form`
  - Update `reminders/tour.tsx` to import from `#app/features/reminders/new` and `#app/features/people/new`
  - _Requirements: 7.2_

- [x] 2.9 Update imports in Shared domain files
  - Update `shared/data-download-button.tsx` to import from `#app/features/shared/data-file-schema`
  - _Requirements: 4.3_

- [x] 2.10 Update imports in route files
  - Update `_app.people.index.tsx` with new People imports
  - Update `_app.people.$personID.tsx` with new People, Notes, Reminders imports
  - Update `_app.reminders.tsx` with new Reminders imports
  - Update `_app.settings.tsx` with new Shared imports
  - Update `tour.tsx` with new tour imports
  - _Requirements: 5.2, 6.2, 7.2_

- [x] 2.11 Verify Phase 2 completion
  - Run `pnpm check` to ensure no TypeScript errors
  - _Requirements: 5.3, 6.3, 7.3, 13.1_

- [ ] 3. Phase 3: Reorganize Tool Files
- [ ] 3.1 Create tool domain directories
  - Create `src/shared/tools/people/`
  - Create `src/shared/tools/notes/`
  - Create `src/shared/tools/reminders/`
  - Create `src/shared/tools/system/`
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 3.2 Move People tool files
  - Move `person-create.ts` to `people/create.ts`
  - Move `person-create-ui.tsx` to `people/create-ui.tsx`
  - Move `person-read.ts` to `people/read.ts`
  - Move `person-read-ui.tsx` to `people/read-ui.tsx`
  - Move `person-update.ts` to `people/update.ts`
  - Move `person-update-ui.tsx` to `people/update-ui.tsx`
  - _Requirements: 9.1_

- [ ] 3.3 Move Notes tool files
  - Move `note-create.ts` to `notes/create.ts`
  - Move `note-create-ui.tsx` to `notes/create-ui.tsx`
  - Move `note-update.ts` to `notes/update.ts`
  - Move `note-update-ui.tsx` to `notes/update-ui.tsx`
  - _Requirements: 10.1_

- [ ] 3.4 Move Reminders tool files
  - Move `reminder-create.ts` to `reminders/create.ts`
  - Move `reminder-create-ui.tsx` to `reminders/create-ui.tsx`
  - Move `reminder-read.ts` to `reminders/read.ts`
  - Move `reminder-read-ui.tsx` to `reminders/read-ui.tsx`
  - Move `reminder-update.ts` to `reminders/update.ts`
  - Move `reminder-update-ui.tsx` to `reminders/update-ui.tsx`
  - _Requirements: 11.1_

- [ ] 3.5 Move System tool files
  - Move `user-question.ts` to `system/user-question.ts`
  - Move `user-question-ui.tsx` to `system/user-question-ui.tsx`
  - _Requirements: 8.3_

- [ ] 3.6 Update tools.ts central exports
  - Update all imports to reference new domain paths (`./people/read`, `./notes/create`, etc.)
  - Verify all tool exports remain unchanged
  - _Requirements: 9.2, 10.2, 11.2, 12.1, 12.3_

- [ ] 3.7 Update ui.tsx central exports
  - Update all imports to reference new domain paths (`./people/create-ui`, `./notes/update-ui`, etc.)
  - Verify all UI component exports remain unchanged
  - _Requirements: 9.2, 10.2, 11.2, 12.2, 12.3_

- [ ] 3.8 Verify Phase 3 completion
  - Run `pnpm check` to ensure no TypeScript errors
  - _Requirements: 9.3, 10.3, 11.3, 13.1_

- [ ] 4. Final Verification
- [ ] 4.1 Run full build verification
  - Run `pnpm check` for TypeScript compilation
  - Run `pnpm build` for production build
  - _Requirements: 13.1, 13.2_

- [ ] 4.2 Run test suite
  - Run `pnpm test` to verify all tests pass
  - _Requirements: 13.3_
