---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
Based on my exploration of the `/starters/react-passkey-auth` example, I need to clarify what features are actually present in this starter. This is a **minimal starter template** that demonstrates basic passkey authentication, but it does **not** include several features you mentioned such as chat API, profile visibility to other users, or extensive offline mode handling.

## What You Can Actually Test in This Starter

### 1. **New User Signup with Passkey**

The signup functionality is available through the "Sign up" button in the authentication interface. [1](#9-0) 

**Manual Test Steps:**
1. Run the app with `npm run dev` and open http://localhost:5173
2. Click the "Sign up" button
3. Your browser will trigger the native passkey/WebAuthn UI (FaceID, TouchID, Windows Hello, or security key prompt)
4. Complete the biometric verification
5. The app should show "You're logged in" in the header

### 2. **Returning User Login with Passkey** [2](#9-1) 

**Manual Test Steps:**
1. After signing up, click "Log out"
2. Click the "Log in" button
3. Your browser will show a list of available passkeys for this site
4. Select your previously created passkey
5. Complete biometric verification
6. You should be logged back in

### 3. **Authentication Status Display**

The app displays authentication status in the header: [3](#9-2) 

**Manual Test:** Check the header text changes between "Authenticate to share the data with another device" (when logged out) and "You're logged in" (when authenticated).

### 4. **Welcome Page and Profile Data**

The welcome page displays the user's first name and calculated age: [4](#9-3) 

**Manual Test Steps:**
1. Enter your first name in the "First name" input field
2. Select a date of birth
3. The welcome message should update to show "Welcome, [YourName]!"
4. Your age should be calculated and displayed

### 5. **Data Persistence** [5](#9-4) 

**Manual Test:** After entering data, click the "refresh" button or manually refresh the browser. Your data should persist across page reloads.

### 6. **Browser Passkey UI Appearance**

The native browser passkey UI is triggered by the WebAuthn API: [6](#9-5) 

The UI appearance depends on your device/browser:
- **macOS/iOS Safari**: FaceID or TouchID prompt
- **Chrome/Edge**: Windows Hello or security key prompt
- **Android Chrome**: Fingerprint or device unlock

### 7. **Error Messages**

The `PasskeyAuthBasicUI` component includes basic error handling: [7](#9-6) [8](#9-7) 

**Manual Test Steps:**
1. Click "Sign up" or "Log in"
2. Cancel the browser's passkey prompt
3. An error message should appear in red at the top of the page

## Features NOT Present in This Starter

The following features you mentioned are **not implemented** in this minimal starter:

1. **Chat API with Jazz authentication** - Not present
2. **Profile visibility to other users** - The profile is set up with "everyone" reader access in the schema, but there's no UI to view other users
3. **Settings page** - No separate settings page exists
4. **Explicit offline mode behavior** - Jazz handles this automatically at the framework level, but there's no UI indication [9](#9-8) 

## Notes

- This starter uses **Jazz Cloud** (`wss://cloud.jazz.tools`) for sync, which enables cross-device functionality automatically.
- The automated test only covers basic page loading and form interaction, not authentication flows (passkeys require user interaction that can't be easily automated). [10](#9-9) 
- For testing passkey authentication in automated tests, you would need a tool like Playwright with virtual authenticator support, which is not set up in this example.
- If you need more comprehensive authentication examples with additional features, you might want to look at other Jazz examples or build upon this starter.

### Citations

**File:** starters/react-passkey-auth/src/AuthButton.tsx (L30-36)
```typescript
    <div className="flex gap-2">
      <button
        className="bg-stone-100 py-1.5 px-3 text-sm rounded-md"
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

**File:** starters/react-passkey-auth/src/App.tsx (L17-24)
```typescript
        <nav className="max-w-2xl mx-auto flex justify-between items-center p-3">
          {isAuthenticated ? (
            <span>You're logged in.</span>
          ) : (
            <span>Authenticate to share the data with another device.</span>
          )}
          <AuthButton />
        </nav>
```

**File:** starters/react-passkey-auth/src/App.tsx (L29-37)
```typescript
        <div className="text-center">
          <h1>
            Welcome{me?.profile.firstName ? <>, {me?.profile.firstName}</> : ""}
            !
          </h1>
          {!!me?.root && (
            <p>As of today, you are {getUserAge(me.root)} years old.</p>
          )}
        </div>
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

**File:** packages/jazz-tools/src/browser/auth/PasskeyAuth.ts (L122-152)
```typescript
    try {
      await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(this.crypto.randomBytes(20)),
          rp: {
            name: this.appName,
            id: this.appHostname,
          },
          user: {
            id: webAuthNCredentialPayload,
            name: username + ` (${new Date().toLocaleString()})`,
            displayName: username,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -8, type: "public-key" },
            { alg: -37, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            requireResidentKey: true,
            residentKey: "required",
            userVerification: "preferred",
          },
          timeout: 60000,
          attestation: "direct",
        },
      });
    } catch (error) {
      throw new Error("Passkey creation aborted", { cause: error });
    }
```

**File:** packages/jazz-tools/src/react/auth/PasskeyAuth.tsx (L71-77)
```typescript
  function handleError(error: Error) {
    if (error.cause instanceof Error) {
      setError(error.cause.message);
    } else {
      setError(error.message);
    }
  }
```

**File:** packages/jazz-tools/src/react/auth/PasskeyAuth.tsx (L90-102)
```typescript
      {error && (
        <div
          style={{
            color: "red",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            padding: "1rem",
          }}
        >
          {error}
        </div>
```

**File:** starters/react-passkey-auth/src/schema.ts (L47-48)
```typescript
      const group = Group.create();
      group.addMember("everyone", "reader"); // The profile info is visible to everyone
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
