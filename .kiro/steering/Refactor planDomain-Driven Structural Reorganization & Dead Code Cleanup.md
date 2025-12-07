---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 



### Refactoring Todo List

Here is a step-by-step plan to organize your codebase by domain.

#### Phase 1: Clean up Auth Migration Debt
*Remove the mental overhead of "temporary" code.*

- [ ] **Clean `src/app/lib/auth-utils.ts`**
    - Remove commented-out Clerk references.
    - Keep the stub functions if they are still needed for strict routing typing, otherwise remove them and update call sites to link directly to `/settings`.
- [ ] **Clean `src/server/features/push-cron.ts`**
    - Remove the large blocks of commented-out code related to `getUsersWithJazz`.
    - If the feature is currently disabled, consider moving the file to `src/server/features/_archived/` or strictly keeping only the active logic.
- [ ] **Update `src/app/components/status-indicator.tsx`**
    - Remove the `// TODO: Replace with Jazz auth` comments if the logic `let isSignedIn = true` is the intended temporary state, or actually implement the Jazz `useIsAuthenticated` check there.

#### Phase 2: Organise Client Features
*Move from a flat list to domain folders in `src/app/features`.*

- [x] **Create Domain Directories**
    - `src/app/features/people/`
    - `src/app/features/notes/`
    - `src/app/features/reminders/`
    - `src/app/features/shared/` (for generic components like `data-file-schema.ts`)
- [x] **Refactor People Feature**
    - Move `person-*.tsx`, `person-*.ts`, `new-person.tsx` into `src/app/features/people/`.
    - Rename files to remove redundant prefixes (e.g., `features/people/list-item.tsx` instead of `person-list-item.tsx`).
    - *Action:* Update imports in `src/app/routes/_app.people.*`.
- [x] **Refactor Notes Feature**
    - Move `note-*.tsx`, `note-*.ts`, `new-note.tsx` into `src/app/features/notes/`.
    - *Action:* Update imports in `src/app/features/people/details.tsx` (formerly `person-details.tsx`).
- [x] **Refactor Reminders Feature**
    - Move `reminder-*.tsx`, `reminder-*.ts`, `new-reminder.tsx` into `src/app/features/reminders/`.
    - *Action:* Update imports in `src/app/routes/_app.reminders.tsx`.

#### Phase 3: Organise Shared Tools
*Mirror the domain structure in your shared tools to make AI logic easier to find.*

- [ ] **Create Tool Domains**
    - `src/shared/tools/people/`
    - `src/shared/tools/notes/`
    - `src/shared/tools/reminders/`
    - `src/shared/tools/system/` (for `user-question`)
- [ ] **Move People Tools**
    - Move `person-create.ts`, `person-read.ts`, `person-update.ts` and their `-ui.tsx` counterparts into `src/shared/tools/people/`.
- [ ] **Move Note Tools**
    - Move `note-create.ts`, `note-update.ts` and their `-ui.tsx` counterparts into `src/shared/tools/notes/`.
- [ ] **Move Reminder Tools**
    - Move `reminder-create.ts`, `reminder-read.ts`, `reminder-update.ts` and their `-ui.tsx` counterparts into `src/shared/tools/reminders/`.
- [ ] **Update Central Exports**
    - Update `src/shared/tools/tools.ts` and `src/shared/tools/ui.tsx` to reference the new paths.

#### Phase 4: Verification

- [ ] **Run Type Check**
    - Run `pnpm check` to ensure all import paths are resolved correctly.
- [ ] **Run Tests**
    - Run `pnpm test` to ensure no logic was broken during the move.
- [ ] **Manual Smoke Test**
    - Start the app (`pnpm dev`).
    - Create a Person.
    - Add a Note.
    - Add a Reminder.
    - Verify the Assistant can still invoke tools (since file paths changed, ensure `tools.ts` exports remained stable).

### Example of Resulting Structure

```text
src/app/features/
├── people/
│   ├── components/    (Optional: for smaller sub-components)
│   ├── form.tsx       (was person-form.tsx)
│   ├── hooks.ts       (was person-hooks.ts)
│   ├── list-item.tsx  (was person-list-item.tsx)
│   ├── details.tsx    (was person-details.tsx)
│   └── tour.tsx
├── notes/
│   ├── form.tsx
│   ├── list-item.tsx
│   └── ...
└── reminders/
    └── ...
```