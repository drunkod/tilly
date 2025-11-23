---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
Based on the codebase structure, here's how to write comprehensive Playwright integration tests for authentication flows in `/starters/react-passkey-auth`:

## Current Test Setup

The project already has Playwright configured [1](#7-0)  with a basic test file [2](#7-1) .

## Key Testing Strategy for Passkey Authentication

To test passkey authentication in Playwright, you'll need to use **Playwright's Virtual Authenticator API** (`cdp.send('WebAuthn.addVirtualAuthenticator')`) since passkeys require WebAuthn support. Here's how to structure your tests:

### 1. **Complete Signup Creating a New Account**

The signup flow is triggered by the "Sign up" button [3](#7-2) . You'll need to:
- Add a virtual authenticator before the test
- Click the "Sign up" button
- Handle the virtual passkey creation
- Verify the user is authenticated by checking for the "You're logged in." text [4](#7-3) 

### 2. **Public Readability of the Profile**

The profile is designed to be publicly readable. The schema shows that profiles are set up with "everyone" as "reader" [5](#7-4) . To test this, you would need to:
- Create an account in one browser context
- Access the profile data from another unauthenticated context
- Verify the public profile fields (like `firstName`) are accessible

### 3. **User Redirection After Signup**

After signup, users remain on the main page. The authentication state changes from showing "Authenticate to share the data with another device." to "You're logged in." [4](#7-3) .

### 4. **Persistence of Account Data After Refresh**

The app explicitly encourages testing this behavior [6](#7-5) . Test by:
- Filling in the form fields (firstName and dateOfBirth) [7](#7-6) 
- Reloading the page
- Verifying the data persists and displays correctly, including the welcome message [8](#7-7) 

### 5. **Successful Login with an Existing Passkey**

The login flow is triggered by the "Log in" button [9](#7-8) . You'll need to:
- Create and register a passkey in the virtual authenticator first (signup)
- Log out [10](#7-9) 
- Click "Log in" button
- Use the virtual authenticator to authenticate
- Verify successful login

### 6. **Loading Correct Account Data After Login**

After login, verify:
- The profile data (firstName) appears in the welcome message [11](#7-10) 
- The root data (dateOfBirth) is displayed and used to calculate age [12](#7-11) 
- The form fields are populated with the correct values [13](#7-12) 

### 7. **Displaying Errors for Failed Logins**

While the current implementation doesn't show explicit error UI in the components, the underlying passkey authentication can fail. Based on the unit tests, passkey errors should throw with the message "Passkey creation aborted" [14](#7-13) . You would test this by:
- Simulating a failed virtual authenticator response
- Verifying appropriate error handling

## Test Structure Example

Your test file should:
1. Set up a virtual authenticator before each test using Chrome DevTools Protocol
2. Use `page.context().addCookies()` or browser context isolation to maintain authentication state
3. Test each scenario in isolation with proper setup and teardown
4. Use the form inputs with IDs "firstName" and "dateOfBirth" for data entry testing

## Notes

- The application uses Jazz's passkey authentication with the app name "jazz-react-tailwind-starter" [15](#7-14) 
- Account migration runs on creation and login, setting up default values if they don't exist [16](#7-15) 
- The profile includes a `firstName` field (public) and the root includes a `dateOfBirth` field (private) [17](#7-16) 
- Playwright's `permissions: ["clipboard-read", "clipboard-write"]` are already configured [18](#7-17) , which may be needed for certain passkey operations
- For testing passkey authentication in Playwright, you'll need to use Chromium browser with CDP (Chrome DevTools Protocol) to add virtual authenticators, as standard Playwright APIs don't directly support WebAuthn testing

### Citations

**File:** starters/react-passkey-auth/playwright.config.ts (L1-46)
```typescript
import { defineConfig, devices } from "@playwright/test";
import isCI from "is-ci";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    permissions: ["clipboard-read", "clipboard-write"],
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: "pnpm preview --port 5173",
      url: "http://localhost:5173/",
      reuseExistingServer: !isCI,
    },
  ],
});
```

**File:** starters/react-passkey-auth/tests/page.spec.ts (L1-9)
```typescript
import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome!")).toBeVisible();

  await page.getByLabel("Name").fill("Bob");
  await expect(page.getByText("Welcome, Bob!")).toBeVisible();
});
```

**File:** starters/react-passkey-auth/src/AuthButton.tsx (L13-16)
```typescript
  function handleLogOut() {
    logOut();
    window.history.pushState({}, "", "/");
  }
```

**File:** starters/react-passkey-auth/src/AuthButton.tsx (L33-36)
```typescript
        onClick={() => auth.signUp("")}
      >
        Sign up
      </button>
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

**File:** starters/react-passkey-auth/src/App.tsx (L18-22)
```typescript
          {isAuthenticated ? (
            <span>You're logged in.</span>
          ) : (
            <span>Authenticate to share the data with another device.</span>
          )}
```

**File:** starters/react-passkey-auth/src/App.tsx (L30-36)
```typescript
          <h1>
            Welcome{me?.profile.firstName ? <>, {me?.profile.firstName}</> : ""}
            !
          </h1>
          {!!me?.root && (
            <p>As of today, you are {getUserAge(me.root)} years old.</p>
          )}
```

**File:** starters/react-passkey-auth/src/App.tsx (L41-51)
```typescript
        <p className="text-center">
          Edit the form above,{" "}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-semibold underline"
          >
            refresh
          </button>{" "}
          this page, and see your changes persist.
        </p>
```

**File:** starters/react-passkey-auth/src/schema.ts (L10-24)
```typescript
export const JazzProfile = co.profile({
  /**
   * Learn about CoValue field/item types here:
   * https://jazz.tools/docs/react/schemas/covalues#covalue-fielditem-types
   */
  firstName: z.string(),

  // Add public fields here
});

/** The account root is an app-specific per-user private `CoMap`
 *  where you can store top-level objects for that user */
export const AccountRoot = co.map({
  dateOfBirth: z.date(),
});
```

**File:** starters/react-passkey-auth/src/schema.ts (L36-44)
```typescript
  .withMigration(async (account) => {
    /** The account migration is run on account creation and on every log-in.
     *  You can use it to set up the account root and any other initial CoValues you need.
     */
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        dateOfBirth: new Date("1/1/1990"),
      });
    }
```

**File:** starters/react-passkey-auth/src/schema.ts (L47-49)
```typescript
      const group = Group.create();
      group.addMember("everyone", "reader"); // The profile info is visible to everyone

```

**File:** starters/react-passkey-auth/src/Form.tsx (L12-44)
```typescript
    <div className="grid gap-4 border p-8 border-stone-200">
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

      {/*Add more fields here*/}
    </div>
  );
```

**File:** packages/jazz-tools/src/browser/tests/PasskeyAuth.test.ts (L147-152)
```typescript
      mockNavigator.credentials.get.mockRejectedValue(
        new Error("User rejected the passkey"),
      );

      await expect(auth.logIn()).rejects.toThrow("Passkey creation aborted");
    });
```

**File:** starters/react-passkey-auth/src/Main.tsx (L11-11)
```typescript
export const APPLICATION_NAME = "jazz-react-tailwind-starter";
```
