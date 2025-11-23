---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 

## Q4
please explain how work /starters/react-passkey-auth

with step by step
### Answer
# How the `/starters/react-passkey-auth` Example Works

## 1. Application Setup

The application starts in `Main.tsx`, which serves as the entry point. It wraps the entire app with the `JazzReactProvider`, which configures the Jazz framework with:

- **Sync server connection**: Connects to Jazz Cloud using a WebSocket URL with an API key jazz:16-18 
- **Account schema**: Specifies the `JazzAccount` schema that defines the structure of user accounts jazz:19-19 
- **Application name**: Defines a constant used to identify the app in passkey authentication jazz:11-11 

The provider also includes a `JazzInspector` component for development debugging jazz:23-23 

## 2. Passkey Authentication Flow

The authentication is handled in `AuthButton.tsx` using the `usePasskeyAuth` hook:

- **Hook initialization**: The `usePasskeyAuth` hook is configured with the application name jazz:9-11 
- **Authentication states**: The component checks `auth.state` to determine if the user is signed in jazz:18-26 
- **Sign up flow**: Users can sign up by calling `auth.signUp("")` (empty string indicates username will be derived from passkey) jazz:33-35 
- **Log in flow**: Users can log in by calling `auth.logIn()` which triggers the browser's passkey authentication jazz:37-42 
- **Log out flow**: Users can log out using `logOut()` from the `useAccount` hook, which also clears the URL history jazz:13-16 

## 3. User Data Schema and Form Management

### Schema Structure

The data schema is defined in `schema.ts` with two main components:

**JazzProfile** - A public CoMap for user profile information that everyone can read: jazz:10-18 

**AccountRoot** - A private CoMap for sensitive user data like date of birth: jazz:22-24 

**JazzAccount** - Combines both profile and root with an account migration function: jazz:31-61 

The migration function runs on account creation and every login, initializing default values if they don't exist. It sets up:
- A default date of birth in the private root
- A profile with public visibility (everyone can read) using a Group with "everyone" as a reader

### Form Management

The `Form.tsx` component provides a reactive form that directly updates the CoValues:

- **Account access**: Uses `useAccount` hook to access the current user's account with resolved profile and root data jazz:5-7 
- **First name field**: Binds to `me.profile.firstName` and updates directly using `me.profile.$jazz.set()` jazz:13-25 
- **Date of birth field**: Binds to `me.root.dateOfBirth` and updates using `me.root.$jazz.set()` with proper date conversion jazz:27-40 

All changes are automatically synced across devices and persisted without explicit save actions.

## 4. UI State Management and Authentication Display

The main `App.tsx` component manages the UI state and authentication display:

**Authentication Status Display**:
- Uses `useIsAuthenticated()` hook to check authentication state jazz:12-12 
- Shows different messages based on authentication state in the header jazz:18-24 

**User Data Display**:
- Accesses the current user via `useAccount` with resolved profile and root data jazz:8-10 
- Displays personalized welcome message with the user's first name if available jazz:30-33 
- Calculates and displays user age using the `getUserAge` helper function jazz:34-36 

The age calculation is handled by a helper function that computes the difference between the current year and the birth year: jazz:26-29 

**Component Composition**:
The app renders the `AuthButton`, `Form`, and informational text, with the form only appearing when user data is available jazz:39-39 

## Notes

- **Automatic Synchronization**: All data changes are automatically synchronized across devices via the Jazz Cloud sync server. No manual save operations are required.
- **Passkey Security**: The authentication uses WebAuthn passkeys, which are more secure than passwords and tied to the user's device biometrics or security keys.
- **Data Privacy Model**: The schema demonstrates two privacy levels - public profile data (readable by everyone) and private root data (only accessible by the user).
- **Real-time Reactivity**: The form fields are directly bound to CoValues, meaning any changes update immediately and persist automatically.
- **Migration Pattern**: The account migration function ensures that every user has properly initialized data structures, running both on account creation and subsequent logins.
### Citations
**File:** starters/react-passkey-auth/src/Main.tsx (L11-11)
```typescript
export const APPLICATION_NAME = "jazz-react-tailwind-starter";
```
**File:** starters/react-passkey-auth/src/Main.tsx (L16-18)
```typescript
      sync={{
        peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
      }}
```
**File:** starters/react-passkey-auth/src/Main.tsx (L19-19)
```typescript
      AccountSchema={JazzAccount}
```
**File:** starters/react-passkey-auth/src/Main.tsx (L23-23)
```typescript
      <JazzInspector />
```
**File:** starters/react-passkey-auth/src/AuthButton.tsx (L9-11)
```typescript
  const auth = usePasskeyAuth({
    appName: APPLICATION_NAME,
  });
```
**File:** starters/react-passkey-auth/src/AuthButton.tsx (L13-16)
```typescript
  function handleLogOut() {
    logOut();
    window.history.pushState({}, "", "/");
  }
```
**File:** starters/react-passkey-auth/src/AuthButton.tsx (L18-26)
```typescript
  if (auth.state === "signedIn") {
    return (
      <button
        className="bg-stone-100 py-1.5 px-3 text-sm rounded-md"
        onClick={handleLogOut}
      >
        Log out
      </button>
    );
```
**File:** starters/react-passkey-auth/src/AuthButton.tsx (L33-35)
```typescript
        onClick={() => auth.signUp("")}
      >
        Sign up
```
**File:** starters/react-passkey-auth/src/AuthButton.tsx (L37-42)
```typescript
      <button
        onClick={() => auth.logIn()}
        className="bg-stone-100 py-1.5 px-3 text-sm rounded-md"
      >
        Log in
      </button>
```
**File:** starters/react-passkey-auth/src/schema.ts (L10-18)
```typescript
export const JazzProfile = co.profile({
  /**
   * Learn about CoValue field/item types here:
   * https://jazz.tools/docs/react/schemas/covalues#covalue-fielditem-types
   */
  firstName: z.string(),

  // Add public fields here
});
```
**File:** starters/react-passkey-auth/src/schema.ts (L22-24)
```typescript
export const AccountRoot = co.map({
  dateOfBirth: z.date(),
});
```
**File:** starters/react-passkey-auth/src/schema.ts (L26-29)
```typescript
export function getUserAge(root: co.loaded<typeof AccountRoot> | undefined) {
  if (!root) return null;
  return new Date().getFullYear() - root.dateOfBirth.getFullYear();
}
```
**File:** starters/react-passkey-auth/src/schema.ts (L31-61)
```typescript
export const JazzAccount = co
  .account({
    profile: JazzProfile,
    root: AccountRoot,
  })
  .withMigration(async (account) => {
    /** The account migration is run on account creation and on every log-in.
     *  You can use it to set up the account root and any other initial CoValues you need.
     */
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        dateOfBirth: new Date("1/1/1990"),
      });
    }

    if (!account.$jazz.has("profile")) {
      const group = Group.create();
      group.addMember("everyone", "reader"); // The profile info is visible to everyone

      account.$jazz.set(
        "profile",
        JazzProfile.create(
          {
            name: "Anonymous user",
            firstName: "",
          },
          group,
        ),
      );
    }
  });
```
**File:** starters/react-passkey-auth/src/Form.tsx (L5-7)
```typescript
  const { me } = useAccount(JazzAccount, {
    resolve: { profile: true, root: true },
  });
```
**File:** starters/react-passkey-auth/src/Form.tsx (L13-25)
```typescript
      <div className="flex items-center gap-3">
        <label htmlFor="firstName" className="sm:w-32">
          First name
        </label>
        <input
          type="text"
          id="firstName"
          placeholder="Enter your first name here..."
          className="border border-stone-300 rounded-sm shadow-xs py-1 px-2 flex-1"
          value={me.profile.firstName || ""}
          onChange={(e) => me.profile.$jazz.set("firstName", e.target.value)}
        />
      </div>
```
**File:** starters/react-passkey-auth/src/Form.tsx (L27-40)
```typescript
      <div className="flex items-center gap-3">
        <label htmlFor="dateOfBirth" className="sm:w-32">
          Date of birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          className="border border-stone-300 rounded-sm shadow-xs py-1 px-2 flex-1"
          value={me.root.dateOfBirth?.toISOString().split("T")[0] || ""}
          onChange={(e) =>
            me.root.$jazz.set("dateOfBirth", new Date(e.target.value))
          }
        />
      </div>
```
**File:** starters/react-passkey-auth/src/App.tsx (L8-10)
```typescript
  const { me } = useAccount(JazzAccount, {
    resolve: { profile: true, root: true },
  });
```
**File:** starters/react-passkey-auth/src/App.tsx (L12-12)
```typescript
  const isAuthenticated = useIsAuthenticated();
```
**File:** starters/react-passkey-auth/src/App.tsx (L18-24)
```typescript
          {isAuthenticated ? (
            <span>You're logged in.</span>
          ) : (
            <span>Authenticate to share the data with another device.</span>
          )}
          <AuthButton />
        </nav>
```
**File:** starters/react-passkey-auth/src/App.tsx (L30-33)
```typescript
          <h1>
            Welcome{me?.profile.firstName ? <>, {me?.profile.firstName}</> : ""}
            !
          </h1>
```
**File:** starters/react-passkey-auth/src/App.tsx (L34-36)
```typescript
          {!!me?.root && (
            <p>As of today, you are {getUserAge(me.root)} years old.</p>
          )}
```
**File:** starters/react-passkey-auth/src/App.tsx (L39-39)
```typescript
        <Form />
```
## Q5
please explain how work /starters/react-passkey-auth

with step by step
## React Passkey Authentication Starter Implementation
This codemap traces the complete React passkey authentication starter template, from Jazz provider setup through authentication flow to user data management. Key locations include the main app structure [1a], authentication button implementation [2a], and form data handling [3a].
### 1. Application Setup and Jazz Provider Configuration
Traces how the React app initializes with Jazz provider, authentication context, and cloud sync configuration
### 1a. Application Identifier (`Main.tsx:11`)
Defines the app name used for passkey authentication
```text
export const APPLICATION_NAME = "jazz-react-tailwind-starter";
```
### 1b. Jazz Provider Setup (`Main.tsx:15`)
Configures Jazz with cloud sync and account schema
```text
<JazzReactProvider
      sync={{
        peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
      }}
      AccountSchema={JazzAccount}
```
### 1c. API Key Configuration (`apiKey.ts:1`)
Sets up Jazz Cloud API key for data synchronization
```text
export const apiKey =
  import.meta.env.VITE_JAZZ_API_KEY ?? "react-passkey-auth@garden.co";
```
### 1d. Account Hook Usage (`App.tsx:8`)
Retrieves user account with profile and root data
```text
const { me } = useAccount(JazzAccount, {
    resolve: { profile: true, root: true },
  });
```
### 2. Passkey Authentication Flow
Demonstrates the complete passkey authentication implementation using WebAuthn API
### 2a. Authentication Hook (`AuthButton.tsx:9`)
Initializes passkey authentication with app name
```text
const auth = usePasskeyAuth({
    appName: APPLICATION_NAME,
  });
```
### 2b. Signup Handler (`AuthButton.tsx:33`)
Triggers new passkey creation and user registration
```text
onClick={() => auth.signUp("")}
```
### 2c. Login Handler (`AuthButton.tsx:38`)
Initiates authentication with existing passkey
```text
onClick={() => auth.logIn()}
```
### 2d. BrowserPasskeyAuth Creation (`PasskeyAuth.tsx:34`)
Instantiates core WebAuthn authentication class
```text
return new BrowserPasskeyAuth(
      context.node.crypto,
      context.authenticate,
      authSecretStorage,
      appName,
      appHostname,
    );
```
### 3. User Data Schema and Form Management
Shows how user data is structured with Jazz schemas and managed through reactive forms
### 3a. Public Profile Schema (`schema.ts:10`)
Defines user profile data structure with validation
```text
export const JazzProfile = co.profile({
  firstName: z.string(),
});
```
### 3b. Private Root Schema (`schema.ts:22`)
Defines private user data structure
```text
export const AccountRoot = co.map({
  dateOfBirth: z.date(),
});
```
### 3c. Profile Form Binding (`Form.tsx:22`)
Two-way binding for profile firstName field
```text
value={me.profile.firstName || ""}
          onChange={(e) => me.profile.$jazz.set("firstName", e.target.value)}
```
### 3d. Root Form Binding (`Form.tsx:36`)
Two-way binding for private dateOfBirth field
```text
onChange={(e) =>
            me.root.$jazz.set("dateOfBirth", new Date(e.target.value))
          }
```
### 3e. Account Migration Setup (`schema.ts:41`)
Initializes default user data on account creation
```text
account.$jazz.set("root", {
        dateOfBirth: new Date("1/1/1990"),
      });
```
### 4. UI State Management and Authentication Display
Illustrates how the UI responds to authentication state changes and user data updates
### 4a. Authentication State Check (`App.tsx:12`)
Monitors current authentication status
```text
const isAuthenticated = useIsAuthenticated();
```
### 4b. Authentication State Check (`AuthButton.tsx:18`)
Conditional rendering based on auth state
```text
if (auth.state === "signedIn") {
```
### 4c. Personalized Welcome (`App.tsx:31`)
Displays user's first name when available
```text
Welcome{me?.profile.firstName ? <>, {me?.profile.firstName}</> : ""}
```
### 4d. Logout Handler (`AuthButton.tsx:13`)
Handles user logout and URL reset
```text
function handleLogOut() {
    logOut();
    window.history.pushState({}, "", "/");
  }
```
## Q6
please help tests for /starters/react-passkey-auth with step by step
what metodology uses?
### Answer
# Testing for `/starters/react-passkey-auth`

The `/starters/react-passkey-auth` example uses **Playwright** for end-to-end (E2E) testing.

## Testing Methodology

The project uses **Playwright** as its testing framework for automated browser testing. jazz:22-22 

## Step-by-Step Testing Process

### 1. **Running Tests**

There are two npm scripts available for running tests:

- `test:e2e` - Runs tests in headless mode
- `test:e2e:ui` - Runs tests with Playwright's UI mode for interactive debugging jazz:10-11 

### 2. **Test Execution Flow**

When you run the tests, the following happens automatically:

**a) Web Server Startup**: The configuration starts a preview server before running tests using `pnpm preview --port 5173`. This server runs on `http://localhost:5173/` and will reuse an existing server if one is already running (except in CI environments). jazz:39-45 

**b) Test Execution**: Tests run against the base URL configured as `http://localhost:5173/`. jazz:23-23 

### 3. **Test Configuration Details**

The Playwright configuration includes:

- **Test Directory**: Tests are located in the `./tests` directory jazz:8-8 
- **Parallel Execution**: Tests run in parallel (fully parallel mode enabled) jazz:10-10 
- **CI Behavior**: On CI, tests run with 1 worker (sequential), 2 retries on failure, and forbid `.only` calls jazz:12-16 
- **Browser**: Tests run on Chromium (Desktop Chrome) jazz:31-36 
- **Permissions**: Clipboard read/write permissions are granted jazz:27-27 
- **Tracing**: Traces are collected on the first retry of failed tests jazz:26-26 

### 4. **Actual Test Cases**

The test suite currently contains one test that verifies:

1. The home page loads successfully
2. A "Welcome!" message is visible
3. Users can fill in a name field
4. A personalized welcome message appears jazz:3-9 

## Notes

- The testing setup is relatively minimal with just one test case, focusing on basic UI functionality
- No passkey authentication flows are currently tested in the existing test suite
- The configuration uses an HTML reporter for test results jazz:18-18 
- The tests require the application to be built before running (via `pnpm preview`), suggesting they test the production build rather than the development server
### Citations
**File:** starters/react-passkey-auth/package.json (L10-11)
```json
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
```
**File:** starters/react-passkey-auth/package.json (L22-22)
```json
    "@playwright/test": "^1.50.1",
```
**File:** starters/react-passkey-auth/playwright.config.ts (L8-8)
```typescript
  testDir: "./tests",
```
**File:** starters/react-passkey-auth/playwright.config.ts (L10-10)
```typescript
  fullyParallel: true,
```
**File:** starters/react-passkey-auth/playwright.config.ts (L12-16)
```typescript
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
```
**File:** starters/react-passkey-auth/playwright.config.ts (L18-18)
```typescript
  reporter: "html",
```
**File:** starters/react-passkey-auth/playwright.config.ts (L23-23)
```typescript
    baseURL: "http://localhost:5173/",
```
**File:** starters/react-passkey-auth/playwright.config.ts (L26-26)
```typescript
    trace: "on-first-retry",
```
**File:** starters/react-passkey-auth/playwright.config.ts (L27-27)
```typescript
    permissions: ["clipboard-read", "clipboard-write"],
```
**File:** starters/react-passkey-auth/playwright.config.ts (L31-36)
```typescript
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
```
**File:** starters/react-passkey-auth/playwright.config.ts (L39-45)
```typescript
  webServer: [
    {
      command: "pnpm preview --port 5173",
      url: "http://localhost:5173/",
      reuseExistingServer: !isCI,
    },
  ],
```
**File:** starters/react-passkey-auth/tests/page.spec.ts (L3-9)
```typescript
test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome!")).toBeVisible();

  await page.getByLabel("Name").fill("Bob");
  await expect(page.getByText("Welcome, Bob!")).toBeVisible();
});
```
## Q7
please help tests for /starters/react-passkey-auth with step by step
what metodology uses?
## Testing Implementation for React Passkey Auth Starter
This codemap traces the complete testing setup for the Jazz React passkey authentication starter, covering Playwright E2E testing methodology from configuration through test execution. Key locations include the Playwright configuration [1a], test script definitions [2a], and the actual test implementation [3a].
### 1. Playwright Test Configuration Setup
Traces how the E2E testing environment is configured with Playwright, including server setup, browser configuration, and CI optimizations
### 1a. Playwright Config Initialization (`playwright.config.ts:7`)
Defines the main Playwright configuration object
```text
export default defineConfig({
```
### 1b. Test Directory Specification (`playwright.config.ts:8`)
Sets the location where test files are stored
```text
testDir: "./tests",
```
### 1c. Base URL Configuration (`playwright.config.ts:23`)
Configures the base URL for test navigation
```text
baseURL: "http://localhost:5173/",
```
### 1d. Web Server Command (`playwright.config.ts:41`)
Specifies the command to start the preview server before tests
```text
command: "pnpm preview --port 5173",
```
### 1e. Server Reuse Logic (`playwright.config.ts:43`)
Configures server reuse based on CI environment detection
```text
reuseExistingServer: !isCI,
```
### 2. Test Scripts and Dependencies
Shows how testing is integrated into the project's package.json scripts and dependencies
### 2a. E2E Test Script (`package.json:10`)
Defines the script for running tests in headless mode
```text
"test:e2e": "playwright test",
```
### 2b. E2E UI Test Script (`package.json:11`)
Defines the script for running tests with interactive UI
```text
"test:e2e:ui": "playwright test --ui",
```
### 2c. Playwright Dependency (`package.json:22`)
Specifies the Playwright test framework version
```text
"@playwright/test": "^1.50.1",
```
### 2d. Build Script (`package.json:8`)
Build script that runs before tests in CI
```text
"build": "tsc -b && vite build",
```
### 3. E2E Test Implementation
Demonstrates the actual test implementation that validates the application's UI functionality
### 3a. Test Case Definition (`page.spec.ts:3`)
Defines the main E2E test for the home page
```text
test("home page loads", async ({ page }) => {
```
### 3b. Page Navigation (`page.spec.ts:4`)
Navigates to the application root URL
```text
await page.goto("/");
```
### 3c. Welcome Message Validation (`page.spec.ts:5`)
Asserts that the welcome message is visible
```text
await expect(page.getByText("Welcome!")).toBeVisible();
```
### 3d. Form Input Interaction (`page.spec.ts:7`)
Fills the name input field with test data
```text
await page.getByLabel("Name").fill("Bob");
```
### 3e. Personalized Message Validation (`page.spec.ts:8`)
Asserts that the personalized welcome appears after form input
```text
await expect(page.getByText("Welcome, Bob!")).toBeVisible();
```
### 4. CI/CD Integration and Test Execution
Shows how the tests are integrated into the CI pipeline and executed across multiple projects
### 4a. CI Workflow Definition (`playwright.yml:1`)
Defines the GitHub Actions workflow for running Playwright tests
```text
name: "Playwright Tests"
```
### 4b. Project Inclusion (`playwright.yml:60`)
Includes the react-passkey-auth starter in the test matrix
```text
starters/react-passkey-auth
```
### 4c. Build Step in CI (`playwright.yml:111`)
Builds the project before running tests in CI
```text
if ! pnpm turbo build; then
```
### 4d. Test Execution in CI (`playwright.yml:121`)
Runs the Playwright tests as part of the CI pipeline
```text
if ! pnpm exec playwright test; then
```