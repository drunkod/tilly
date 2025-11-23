---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 

Directory structure:
└── react-passkey-auth/
    ├── README.md
    ├── CHANGELOG.md
    ├── index.html
    ├── package.json
    ├── playwright.config.ts
    ├── postcss.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vercel.json
    ├── vite.config.ts
    ├── .env.example
    ├── src/
    │   ├── apiKey.ts
    │   ├── App.tsx
    │   ├── AuthButton.tsx
    │   ├── Form.tsx
    │   ├── index.css
    │   ├── Logo.tsx
    │   ├── Main.tsx
    │   ├── schema.ts
    │   └── vite-env.d.ts
    └── tests/
        └── page.spec.ts


Files Content:

================================================
FILE: starters/react-passkey-auth/README.md
================================================
# Jazz React starter with Tailwind and Passkey Auth

A minimal starter template for building apps with **[Jazz](https://jazz.tools)**, React, TailwindCSS, and Passkey Auth.

## Creating an app

Create a new Jazz app.
```bash
npx create-jazz-app@latest
```

## Running locally

Install dependencies:

```bash
npm i
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Learning Jazz

You can start by playing with the form, adding a new field in [./src/schema.ts](./src/schema.ts),
and seeing how easy it is to structure your data, and perform basic operations.

## Questions / problems / feedback

If you have feedback, let us know on [Discord](https://discord.gg/utDMjHYg42) or open an issue or PR to fix something that seems wrong.


## Configuration: sync server

By default, the React starter app uses [Jazz Cloud](https://jazz.tools/cloud) (`wss://cloud.jazz.tools`) - so cross-device use, invites and collaboration should just work.

You can also run a local sync server by running `npx jazz-run sync`, and setting the `sync` parameter of `JazzReactProvider` in [./src/app.tsx](./src/app.tsx) to `{ peer: "ws://localhost:4200" }`.



================================================
FILE: starters/react-passkey-auth/CHANGELOG.md
================================================
# jazz-react-tailwind-starter

## 0.0.201

### Patch Changes

- Updated dependencies [cddbfdb]
- Updated dependencies [114e4ce]
  - jazz-tools@0.19.3

## 0.0.200

### Patch Changes

- Updated dependencies [ef24afb]
- Updated dependencies [5f2b34b]
  - jazz-tools@0.19.2

## 0.0.199

### Patch Changes

- Updated dependencies [f444bd9]
  - jazz-tools@0.19.1

## 0.0.198

### Patch Changes

- 26386d9: Add explicit CoValue loading states:
  - Add `$isLoaded` field to discriminate between loaded and unloaded CoValues
  - Add `$jazz.loadingState` field to provide additional info about the loading state
  - All methods and functions that load CoValues now return a `MaybeLoaded<CoValue>` instead of `CoValue | null | undefined`
  - Rename `$onError: null` to `$onError: "catch"`
  - Split the `useAccount` hook into three separate hooks:
    - `useAccount`: now only returns an Account CoValue
    - `useLogOut`: returns a function for logging out of the current account
    - `useAgent`: returns the current agent
  - Add a `select` option (and an optional `equalityFn`) to `useAccount` and `useCoState`, and remove `useAccountWithSelector` and `useCoStateWithSelector`.
  - Allow specifying resolve queries at the schema level. Those queries will be used when loading CoValues, if no other resolve query is provided.
- Updated dependencies [26386d9]
  - jazz-tools@0.19.0

## 0.0.197

### Patch Changes

- Updated dependencies [349ca48]
  - jazz-tools@0.18.38

## 0.0.196

### Patch Changes

- Updated dependencies [feecdae]
- Updated dependencies [a841071]
- Updated dependencies [68e0b26]
  - jazz-tools@0.18.37

## 0.0.195

### Patch Changes

- jazz-tools@0.18.36

## 0.0.194

### Patch Changes

- jazz-tools@0.18.35

## 0.0.193

### Patch Changes

- Updated dependencies [7a64465]
  - jazz-tools@0.18.34

## 0.0.192

### Patch Changes

- Updated dependencies [df0045e]
- Updated dependencies [5ffe0a9]
  - jazz-tools@0.18.33

## 0.0.191

### Patch Changes

- Updated dependencies [314c199]
  - jazz-tools@0.18.32

## 0.0.190

### Patch Changes

- jazz-tools@0.18.31

## 0.0.189

### Patch Changes

- Updated dependencies [b3dbcaa]
- Updated dependencies [75d452e]
- Updated dependencies [346c5fb]
- Updated dependencies [354895b]
- Updated dependencies [162757c]
- Updated dependencies [d08b7e2]
- Updated dependencies [ad19280]
  - jazz-tools@0.18.30

## 0.0.188

### Patch Changes

- Updated dependencies [cc7efc8]
- Updated dependencies [f55d17f]
  - jazz-tools@0.18.29

## 0.0.187

### Patch Changes

- Updated dependencies [8cbbe0e]
- Updated dependencies [14806c8]
  - jazz-tools@0.18.28

## 0.0.186

### Patch Changes

- Updated dependencies [6c6eb35]
- Updated dependencies [6ca0b59]
- Updated dependencies [88c5f1c]
  - jazz-tools@0.18.27

## 0.0.185

### Patch Changes

- Updated dependencies [4e0ea26]
  - jazz-tools@0.18.26

## 0.0.184

### Patch Changes

- Updated dependencies [4036737]
- Updated dependencies [8ae7d71]
- Updated dependencies [b1d0081]
- Updated dependencies [36a5c58]
- Updated dependencies [94e7d89]
  - jazz-tools@0.18.25

## 0.0.183

### Patch Changes

- Updated dependencies [f4c4ee9]
- Updated dependencies [a15e2ba]
  - jazz-tools@0.18.24

## 0.0.182

### Patch Changes

- Updated dependencies [a0c8a2d]
  - jazz-tools@0.18.23

## 0.0.181

### Patch Changes

- Updated dependencies [22200ac]
- Updated dependencies [1e20db6]
  - jazz-tools@0.18.22

## 0.0.180

### Patch Changes

- Updated dependencies [6819f20]
  - jazz-tools@0.18.21

## 0.0.179

### Patch Changes

- Updated dependencies [c34a793]
- Updated dependencies [2c01529]
- Updated dependencies [7b0facc]
- Updated dependencies [47c7dd3]
- Updated dependencies [d0e2210]
  - jazz-tools@0.18.20

## 0.0.178

### Patch Changes

- Updated dependencies [f88db5f]
- Updated dependencies [8eac2fc]
- Updated dependencies [08b6c03]
  - jazz-tools@0.18.19

## 0.0.177

### Patch Changes

- Updated dependencies [f2f478a]
- Updated dependencies [ed7e353]
- Updated dependencies [1698d41]
  - jazz-tools@0.18.18

## 0.0.176

### Patch Changes

- Updated dependencies [75d1afa]
- Updated dependencies [8aa4acd]
  - jazz-tools@0.18.17

## 0.0.175

### Patch Changes

- Updated dependencies [67b95b7]
  - jazz-tools@0.18.16

## 0.0.174

### Patch Changes

- Updated dependencies [a584ab3]
  - jazz-tools@0.18.15

## 0.0.173

### Patch Changes

- Updated dependencies [a04435e]
  - jazz-tools@0.18.14

## 0.0.172

### Patch Changes

- Updated dependencies [2ddf4d9]
- Updated dependencies [45981cf]
  - jazz-tools@0.18.13

## 0.0.171

### Patch Changes

- Updated dependencies [c16ce4b]
- Updated dependencies [0b1b050]
  - jazz-tools@0.18.12

## 0.0.170

### Patch Changes

- Updated dependencies [06b4617]
- Updated dependencies [70eb465]
  - jazz-tools@0.18.11

## 0.0.169

### Patch Changes

- jazz-tools@0.18.10

## 0.0.168

### Patch Changes

- Updated dependencies [c8167de]
- Updated dependencies [910b8d6]
  - jazz-tools@0.18.9

## 0.0.167

### Patch Changes

- Updated dependencies [700fe46]
- Updated dependencies [aba0d55]
  - jazz-tools@0.18.8

## 0.0.166

### Patch Changes

- Updated dependencies [cf26739]
- Updated dependencies [a3cd9c8]
- Updated dependencies [ca5cd26]
- Updated dependencies [32d1444]
  - jazz-tools@0.18.7

## 0.0.165

### Patch Changes

- Updated dependencies [975d1c3]
- Updated dependencies [ccbb795]
- Updated dependencies [0dae338]
- Updated dependencies [934679c]
- Updated dependencies [28defd0]
- Updated dependencies [e0f17ed]
- Updated dependencies [88ef339]
  - jazz-tools@0.18.6

## 0.0.164

### Patch Changes

- Updated dependencies [ff35d8c]
- Updated dependencies [f23a7a7]
- Updated dependencies [f5d8424]
- Updated dependencies [4e976b8]
  - jazz-tools@0.18.5

## 0.0.163

### Patch Changes

- Updated dependencies [84313aa]
- Updated dependencies [89aab7b]
  - jazz-tools@0.18.4

## 0.0.162

### Patch Changes

- Updated dependencies [b526ab6]
- Updated dependencies [d69aa68]
  - jazz-tools@0.18.3

## 0.0.161

### Patch Changes

- jazz-tools@0.18.2

## 0.0.160

### Patch Changes

- Updated dependencies [af5fbe7]
- Updated dependencies [9837459]
  - jazz-tools@0.18.1

## 0.0.159

### Patch Changes

- f263856: Add `$jazz` field to CoValues:
  - This field contains Jazz methods that cluttered CoValues' API, as well as Jazz internal properties. This field is not enumerable, to allow CoValues to behave similarly to JSON objects.
  - Added a `$jazz.set` method to update a CoValue's fields. When updating collaborative fields, you can pass in JSON objects instead of CoValues and Jazz will create
    the CoValues automatically (similarly to CoValue `create` methods).
  - All CoMap methods have been moved into `$jazz`, to allow defining any arbitrary key in the CoMap (except for `$jazz`) without conflicts.
    - For CoMaps created with `co.map`, fields are now `readonly` to prevent setting properties directly. Use the `$jazz.set` method instead.
    - CoMaps created with class schemas don't get type errors on direct property assignments, but they get a runtime errors prompting indicating to use `$jazz.set`.
    - the `delete` operator can no longer be used to delete CoRecord properties. Use `$jazz.delete` instead.
  - CoList's array-mutation methods have been moved into `$jazz`, in order to prevent using methods
    - CoLists are now readonly arrays. Trying to use any mutation method yields a type error.
    - `$jazz.set` can be used in place of direct element assignments.
    - Added two new utility methods: `$jazz.remove` and `$jazz.retain`. They allow editing a CoList in-place with a simpler API than `$jazz.splice`.
    - `sort`, `reverse`, `fill` and `copyWithin` have been deprecated, given that they could behave inconsistently with CoLists. `$jazz` replacements may be introduced
      in future releases.
  - `.$jazz.owner` now always returns a Group (instead of a Group or an Account). We'll be migrating away of having Accounts as CoValue owners in future releases.
  - Removed `castAs`, since it's an inherently unsafe operation that bypassed typechecking and enabled using CoValues in unsupported ways.
  - Removed the `id` and `_type` fields from `toJSON()`'s output in Account, CoMap, CoFeed & FileStream, to make CoValues behave more similarly to JSON objects.
  - Removed the `root` and `profile` fields from Group.
- Updated dependencies [f263856]
  - jazz-tools@0.18.0

## 0.0.158

### Patch Changes

- Updated dependencies [cc2f774]
  - jazz-tools@0.17.14

## 0.0.157

### Patch Changes

- Updated dependencies [d208cd1]
- Updated dependencies [7821a8b]
  - jazz-tools@0.17.13

## 0.0.156

### Patch Changes

- Updated dependencies [1ccae1a]
  - jazz-tools@0.17.12

## 0.0.155

### Patch Changes

- Updated dependencies [8f3852b]
- Updated dependencies [bb9d837]
  - jazz-tools@0.17.11

## 0.0.154

### Patch Changes

- jazz-tools@0.17.10

## 0.0.153

### Patch Changes

- Updated dependencies [52ea0c7]
  - jazz-tools@0.17.9

## 0.0.152

### Patch Changes

- Updated dependencies [ac3e694]
- Updated dependencies [6dbb053]
- Updated dependencies [1a182f0]
  - jazz-tools@0.17.8

## 0.0.151

### Patch Changes

- jazz-tools@0.17.7

## 0.0.150

### Patch Changes

- Updated dependencies [82de51c]
- Updated dependencies [694b168]
  - jazz-tools@0.17.6

## 0.0.149

### Patch Changes

- Updated dependencies [5963658]
  - jazz-tools@0.17.5

## 0.0.148

### Patch Changes

- Updated dependencies [7dd3d00]
  - jazz-tools@0.17.4

## 0.0.147

### Patch Changes

- jazz-tools@0.17.3

## 0.0.146

### Patch Changes

- Updated dependencies [794681a]
- Updated dependencies [83fc22f]
  - jazz-tools@0.17.2

## 0.0.145

### Patch Changes

- Updated dependencies [0bcbf55]
- Updated dependencies [d1bdbf5]
- Updated dependencies [4b73834]
  - jazz-tools@0.17.1

## 0.0.144

### Patch Changes

- Updated dependencies [fcaf4b9]
  - jazz-tools@0.17.0

## 0.0.143

### Patch Changes

- Updated dependencies [67e0968]
- Updated dependencies [2c8120d]
  - jazz-tools@0.16.6

## 0.0.142

### Patch Changes

- Updated dependencies [3cd1586]
- Updated dependencies [33ebbf0]
  - jazz-tools@0.16.5

## 0.0.141

### Patch Changes

- Updated dependencies [16764f6]
  - jazz-tools@0.16.4

## 0.0.140

### Patch Changes

- Updated dependencies [43d3511]
  - jazz-tools@0.16.3

## 0.0.139

### Patch Changes

- jazz-tools@0.16.2

## 0.0.138

### Patch Changes

- Updated dependencies [c62abef]
  - jazz-tools@0.16.1

## 0.0.137

### Patch Changes

- Updated dependencies [c09dcdf]
- Updated dependencies [2bbb07b]
  - jazz-tools@0.16.0

## 0.0.136

### Patch Changes

- Updated dependencies [9633d01]
- Updated dependencies [4beafb7]
  - jazz-tools@0.15.16

## 0.0.135

### Patch Changes

- Updated dependencies [3fe53a3]
  - jazz-tools@0.15.15

## 0.0.134

### Patch Changes

- Updated dependencies [a584590]
- Updated dependencies [9acccb5]
  - jazz-tools@0.15.14

## 0.0.133

### Patch Changes

- Updated dependencies [6c76ff8]
  - jazz-tools@0.15.13

## 0.0.132

### Patch Changes

- Updated dependencies [d1c1b0c]
- Updated dependencies [cf4ad72]
  - jazz-tools@0.15.12

## 0.0.131

### Patch Changes

- Updated dependencies [bdc9aee]
  - jazz-tools@0.15.11

## 0.0.130

### Patch Changes

- Updated dependencies [9815ec6]
- Updated dependencies [b4fdab4]
  - jazz-tools@0.15.10

## 0.0.129

### Patch Changes

- Updated dependencies [27b4837]
  - jazz-tools@0.15.9

## 0.0.128

### Patch Changes

- Updated dependencies [3844666]
  - jazz-tools@0.15.8

## 0.0.127

### Patch Changes

- Updated dependencies [c09b636]
  - jazz-tools@0.15.7

## 0.0.126

### Patch Changes

- Updated dependencies [a5ceaff]
  - jazz-tools@0.15.6

## 0.0.125

### Patch Changes

- Updated dependencies [23bfea5]
- Updated dependencies [e4ba23c]
- Updated dependencies [4b89838]
  - jazz-tools@0.15.5

## 0.0.124

### Patch Changes

- jazz-tools@0.15.4

## 0.0.123

### Patch Changes

- Updated dependencies [45f73a7]
  - jazz-tools@0.15.3

## 0.0.122

### Patch Changes

- Updated dependencies [0e7e532]
  - jazz-tools@0.15.2

## 0.0.121

### Patch Changes

- Updated dependencies [0e3a4d2]
- Updated dependencies [b110f00]
  - jazz-tools@0.15.1

## 0.0.120

### Patch Changes

- Updated dependencies [1378a1f]
- Updated dependencies [0fa051a]
  - jazz-tools@0.15.0

## 0.0.119

### Patch Changes

- Updated dependencies [06c5a1c]
  - jazz-tools@0.14.28
  - jazz-inspector@0.14.28
  - jazz-react@0.14.28

## 0.0.118

### Patch Changes

- Updated dependencies [a026073]
  - jazz-tools@0.14.27
  - jazz-inspector@0.14.27
  - jazz-react@0.14.27

## 0.0.117

### Patch Changes

- jazz-inspector@0.14.26
- jazz-react@0.14.26
- jazz-tools@0.14.26



================================================
FILE: starters/react-passkey-auth/index.html
================================================
<!doctype html>
<html lang="en" class="h-full">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jazz | React + Tailwind</title>
  </head>
  <body class="h-full flex flex-col">
    <div id="root" class="align-self-center flex-1"></div>
    <script type="module" src="/src/Main.tsx"></script>
  </body>
</html>



================================================
FILE: starters/react-passkey-auth/package.json
================================================
{
  "name": "jazz-react-passkey-auth-starter",
  "private": true,
  "version": "0.0.201",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "format-and-lint": "biome check .",
    "format-and-lint:fix": "biome check . --write"
  },
  "dependencies": {
    "jazz-tools": "workspace:*",
    "react": "catalog:react",
    "react-dom": "catalog:react"
  },
  "devDependencies": {
    "@biomejs/biome": "catalog:default",
    "@playwright/test": "^1.50.1",
    "@tailwindcss/postcss": "^4.1.10",
    "@types/react": "catalog:react",
    "@types/react-dom": "catalog:react",
    "@vitejs/plugin-react": "^4.5.1",
    "globals": "^15.11.0",
    "is-ci": "^3.0.1",
    "postcss": "^8.4.27",
    "tailwindcss": "^4.1.10",
    "typescript": "catalog:default",
    "vite": "catalog:default"
  }
}



================================================
FILE: starters/react-passkey-auth/playwright.config.ts
================================================
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



================================================
FILE: starters/react-passkey-auth/postcss.config.js
================================================
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};



================================================
FILE: starters/react-passkey-auth/tsconfig.app.json
================================================
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}



================================================
FILE: starters/react-passkey-auth/tsconfig.json
================================================
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}



================================================
FILE: starters/react-passkey-auth/tsconfig.node.json
================================================
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}



================================================
FILE: starters/react-passkey-auth/vercel.json
================================================
{
  "build": {
    "env": {
      "APP_NAME": "jazz-react-tailwind-starter"
    }
  },
  "ignoreCommand": "node ../../ignore-vercel-build.js"
}



================================================
FILE: starters/react-passkey-auth/vite.config.ts
================================================
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});



================================================
FILE: starters/react-passkey-auth/.env.example
================================================
VITE_JAZZ_API_KEY=


================================================
FILE: starters/react-passkey-auth/src/apiKey.ts
================================================
export const apiKey =
  import.meta.env.VITE_JAZZ_API_KEY ?? "react-passkey-auth@garden.co";



================================================
FILE: starters/react-passkey-auth/src/App.tsx
================================================
import { useAccount, useIsAuthenticated } from "jazz-tools/react";
import { AuthButton } from "./AuthButton.tsx";
import { Form } from "./Form.tsx";
import { Logo } from "./Logo.tsx";
import { JazzAccount, getUserAge } from "./schema.ts";

function App() {
  const me = useAccount(JazzAccount, {
    resolve: { profile: true, root: true },
  });

  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <header>
        <nav className="max-w-2xl mx-auto flex justify-between items-center p-3">
          {isAuthenticated ? (
            <span>You're logged in.</span>
          ) : (
            <span>Authenticate to share the data with another device.</span>
          )}
          <AuthButton />
        </nav>
      </header>
      <main className="max-w-2xl mx-auto px-3 mt-16 flex flex-col gap-8">
        <Logo />

        <div className="text-center">
          <h1>
            Welcome
            {me.$isLoaded && me.profile.firstName ? (
              <>, {me.profile.firstName}</>
            ) : (
              ""
            )}
            !
          </h1>
          {me.$isLoaded && (
            <p>As of today, you are {getUserAge(me.root)} years old.</p>
          )}
        </div>

        <Form />

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

        <p className="text-center">
          Edit <code className="font-semibold">schema.ts</code> to add more
          fields.
        </p>

        <p className="text-center my-16">
          Go to{" "}
          <a className="font-semibold underline" href="https://jazz.tools/docs">
            jazz.tools/docs
          </a>{" "}
          for our docs.
        </p>
      </main>
    </>
  );
}

export default App;



================================================
FILE: starters/react-passkey-auth/src/AuthButton.tsx
================================================
"use client";

import { usePasskeyAuth, useLogOut } from "jazz-tools/react";
import { APPLICATION_NAME } from "./Main";

export function AuthButton() {
  const logOut = useLogOut();

  const auth = usePasskeyAuth({
    appName: APPLICATION_NAME,
  });

  function handleLogOut() {
    logOut();
    window.history.pushState({}, "", "/");
  }

  if (auth.state === "signedIn") {
    return (
      <button
        className="bg-stone-100 py-1.5 px-3 text-sm rounded-md"
        onClick={handleLogOut}
      >
        Log out
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        className="bg-stone-100 py-1.5 px-3 text-sm rounded-md"
        onClick={() => auth.signUp("")}
      >
        Sign up
      </button>
      <button
        onClick={() => auth.logIn()}
        className="bg-stone-100 py-1.5 px-3 text-sm rounded-md"
      >
        Log in
      </button>
    </div>
  );
}



================================================
FILE: starters/react-passkey-auth/src/Form.tsx
================================================
import { useAccount } from "jazz-tools/react";
import { JazzAccount } from "./schema";

export function Form() {
  const me = useAccount(JazzAccount, {
    resolve: { profile: true, root: true },
  });

  if (!me.$isLoaded) return null;

  return (
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
}



================================================
FILE: starters/react-passkey-auth/src/index.css
================================================
@import "tailwindcss";



================================================
FILE: starters/react-passkey-auth/src/Logo.tsx
================================================
export function Logo() {
  return (
    <svg
      viewBox="0 0 386 146"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black w-48 mx-auto"
    >
      <path
        d="M176.725 33.865H188.275V22.7H176.725V33.865ZM164.9 129.4H172.875C182.72 129.4 188.275 123.9 188.275 114.22V43.6H176.725V109.545C176.725 115.65 173.975 118.51 167.925 118.51H164.9V129.4ZM245.298 53.28C241.613 45.47 233.363 41.95 222.748 41.95C208.998 41.95 200.748 48.44 197.888 58.615L208.613 61.915C210.648 55.315 216.368 52.565 222.638 52.565C231.933 52.565 235.673 56.415 236.058 64.61C226.433 65.93 216.643 67.195 209.768 69.23C200.583 72.145 195.743 77.865 195.743 86.83C195.743 96.51 202.673 104.65 215.818 104.65C225.443 104.65 232.318 101.35 237.213 94.365V103H247.388V66.425C247.388 61.475 247.168 57.185 245.298 53.28ZM217.853 95.245C210.483 95.245 207.128 91.34 207.128 86.72C207.128 82.045 210.593 79.515 215.323 77.92C220.328 76.435 226.983 75.5 235.948 74.18C235.893 76.93 235.673 80.725 234.738 83.475C233.418 89.25 227.643 95.245 217.853 95.245ZM251.22 103H301.545V92.715H269.535L303.195 45.47V43.6H254.3V53.885H284.935L251.22 101.185V103ZM304.815 103H355.14V92.715H323.13L356.79 45.47V43.6H307.895V53.885H338.53L304.815 101.185V103Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M136.179 44.8277C136.179 44.8277 136.179 44.8277 136.179 44.8276V21.168C117.931 28.5527 97.9854 32.6192 77.0897 32.6192C65.1466 32.6192 53.5138 31.2908 42.331 28.7737V51.4076C42.331 51.4076 42.331 51.4076 42.331 51.4076V81.1508C41.2955 80.4385 40.1568 79.8458 38.9405 79.3915C36.1732 78.358 33.128 78.0876 30.1902 78.6145C27.2524 79.1414 24.5539 80.4419 22.4358 82.3516C20.3178 84.2613 18.8754 86.6944 18.291 89.3433C17.7066 91.9921 18.0066 94.7377 19.1528 97.2329C20.2991 99.728 22.2403 101.861 24.7308 103.361C27.2214 104.862 30.1495 105.662 33.1448 105.662H33.1455C33.6061 105.662 33.8365 105.662 34.0314 105.659C44.5583 105.449 53.042 96.9656 53.2513 86.4386C53.2534 86.3306 53.2544 86.2116 53.2548 86.0486H53.2552V85.7149L53.2552 85.5521V82.0762L53.2552 53.1993C61.0533 54.2324 69.0092 54.7656 77.0897 54.7656C77.6696 54.7656 78.2489 54.7629 78.8276 54.7574V110.696C77.792 109.983 76.6533 109.391 75.437 108.936C72.6697 107.903 69.6246 107.632 66.6867 108.159C63.7489 108.686 61.0504 109.987 58.9323 111.896C56.8143 113.806 55.3719 116.239 54.7875 118.888C54.2032 121.537 54.5031 124.283 55.6494 126.778C56.7956 129.273 58.7368 131.405 61.2273 132.906C63.7179 134.406 66.646 135.207 69.6414 135.207C70.1024 135.207 70.3329 135.207 70.5279 135.203C81.0548 134.994 89.5385 126.51 89.7478 115.983C89.7517 115.788 89.7517 115.558 89.7517 115.097V111.621L89.7517 54.3266C101.962 53.4768 113.837 51.4075 125.255 48.2397V80.9017C124.219 80.1894 123.081 79.5966 121.864 79.1424C119.097 78.1089 116.052 77.8384 113.114 78.3653C110.176 78.8922 107.478 80.1927 105.36 82.1025C103.242 84.0122 101.799 86.4453 101.215 89.0941C100.631 91.743 100.931 94.4886 102.077 96.9837C103.223 99.4789 105.164 101.612 107.655 103.112C110.145 104.612 113.073 105.413 116.069 105.413C116.53 105.413 116.76 105.413 116.955 105.409C127.482 105.2 135.966 96.7164 136.175 86.1895C136.179 85.9945 136.179 85.764 136.179 85.3029V81.8271L136.179 44.8277Z"
        fill="#146AFF"
      />
    </svg>
  );
}



================================================
FILE: starters/react-passkey-auth/src/Main.tsx
================================================
import { JazzReactProvider } from "jazz-tools/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { JazzInspector } from "jazz-tools/inspector";
import { apiKey } from "./apiKey.ts";
import { JazzAccount } from "./schema.ts";

// This identifies the app in the passkey auth
export const APPLICATION_NAME = "jazz-react-tailwind-starter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JazzReactProvider
      sync={{
        peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
      }}
      AccountSchema={JazzAccount}
    >
      <App />

      <JazzInspector />
    </JazzReactProvider>
  </StrictMode>,
);



================================================
FILE: starters/react-passkey-auth/src/schema.ts
================================================
/**
 * Learn about schemas here:
 * https://jazz.tools/docs/react/schemas/covalues
 */

import { Group, co, z } from "jazz-tools";

/** The account profile is an app-specific per-user public `CoMap`
 *  where you can store top-level objects for that user */
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

export function getUserAge(root: co.loaded<typeof AccountRoot> | undefined) {
  if (!root) return null;
  return new Date().getFullYear() - root.dateOfBirth.getFullYear();
}

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



================================================
FILE: starters/react-passkey-auth/src/vite-env.d.ts
================================================
/// <reference types="vite/client" />



================================================
FILE: starters/react-passkey-auth/tests/page.spec.ts
================================================
import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Welcome!")).toBeVisible();

  await page.getByLabel("Name").fill("Bob");
  await expect(page.getByText("Welcome, Bob!")).toBeVisible();
});


