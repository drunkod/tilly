---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 

# API Authentication in `/starters/react-passkey-auth`

The `/starters/react-passkey-auth` example uses Jazz's passkey-based authentication system, which differs significantly from traditional token-based API authentication. Here's how it works:

## Authentication Setup

The application initializes authentication through the `JazzReactProvider` which connects to a sync server: [1](#8-0) 

The sync connection uses an API key for the sync server, not for user authentication: [2](#8-1) 

## How Authenticated Requests Are Made

### 1. Passkey Authentication Flow

Users authenticate using WebAuthn passkeys. The `usePasskeyAuth` hook provides sign-up and login methods: [3](#8-2) 

### 2. Credential Storage

During login, the passkey contains the user's cryptographic secret seed and account ID embedded in its `userHandle`: [4](#8-3) 

These credentials are stored locally using `AuthSecretStorage`: [5](#8-4) 

### 3. Establishing Authenticated Connections

When credentials exist, Jazz creates an authenticated context with a `LocalNode` that uses the account's secret for all cryptographic operations: [6](#8-5) 

The sync connection is established through WebSocket peers, and all messages are cryptographically signed using the account's secret: [7](#8-6) 

## How Unauthenticated Requests Are Handled

### 1. Anonymous Account Creation

If no credentials are found, Jazz automatically creates an anonymous account: [8](#8-7) 

### 2. Anonymous to Authenticated Migration

When a user authenticates after using the app anonymously, Jazz migrates their data from the anonymous account to the authenticated account: [9](#8-8) 

The migration process connects the two accounts as peers to transfer data: [10](#8-9) 

## How Tokens (Expired/Invalid) Are Managed

**Important: Jazz does not use traditional JWT tokens or token expiration.** Instead:

### 1. Cryptographic Secrets (Not Tokens)

Jazz uses cryptographic secrets (AgentSecret) that are derived from a secret seed. These secrets don't expire: [11](#8-10) 

### 2. Persistent Storage

Credentials are stored persistently in browser storage (localStorage/IndexedDB) and remain valid indefinitely: [12](#8-11) 

### 3. Connection Health Monitoring

Instead of token expiration, the WebSocket connection monitors health through ping/pong messages with a 10-second timeout: [13](#8-12) 

### 4. Authentication State Management

The application checks authentication state through the `useIsAuthenticated` hook which monitors the auth storage: [14](#8-13) 

## Notes

- **No Token Expiration**: Unlike traditional API authentication with JWT tokens, Jazz uses cryptographic secrets that don't expire. The user remains authenticated until they explicitly log out or clear their browser storage.

- **Cryptographic Security**: All data operations are cryptographically signed using the user's secret, providing end-to-end security without needing server-side token validation for each request.

- **Offline-First**: The authentication model supports offline operation since credentials are stored locally and don't require server validation for each action.

- **WebSocket Connection**: The sync connection uses WebSocket rather than HTTP requests, and connection health is monitored through ping/pong rather than token refresh mechanisms.

- **Logout Handling**: When users log out, credentials are cleared from storage and a new anonymous account is created: [15](#8-14)

### Citations

**File:** starters/react-passkey-auth/src/Main.tsx (L13-25)
```typescript
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
```

**File:** starters/react-passkey-auth/src/apiKey.ts (L1-2)
```typescript
export const apiKey =
  import.meta.env.VITE_JAZZ_API_KEY ?? "react-passkey-auth@garden.co";
```

**File:** starters/react-passkey-auth/src/AuthButton.tsx (L9-43)
```typescript
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
```

**File:** packages/jazz-tools/src/browser/auth/PasskeyAuth.ts (L31-68)
```typescript
  logIn = async () => {
    const { crypto, authenticate } = this;

    const webAuthNCredential = await this.getPasskeyCredentials();

    if (!webAuthNCredential) {
      return;
    }

    const webAuthNCredentialPayload = new Uint8Array(
      webAuthNCredential.response.userHandle,
    );
    const accountSecretSeed = webAuthNCredentialPayload.slice(
      0,
      cojsonInternals.secretSeedLength,
    );

    const secret = crypto.agentSecretFromSecretSeed(accountSecretSeed);

    const accountID = cojsonInternals.rawCoIDfromBytes(
      webAuthNCredentialPayload.slice(
        cojsonInternals.secretSeedLength,
        cojsonInternals.secretSeedLength + cojsonInternals.shortHashLength,
      ),
    ) as ID<Account>;

    await authenticate({
      accountID,
      accountSecret: secret,
    });

    await this.authSecretStorage.set({
      accountID,
      secretSeed: accountSecretSeed,
      accountSecret: secret,
      provider: "passkey",
    });
  };
```

**File:** packages/jazz-tools/src/tools/auth/AuthSecretStorage.ts (L10-22)
```typescript
export type AuthSetPayload = {
  accountID: ID<Account>;
  secretSeed?: Uint8Array;
  accountSecret: AgentSecret;
  provider:
    | "anonymous"
    | "clerk"
    | "betterauth"
    | "demo"
    | "passkey"
    | "passphrase"
    | string;
};
```

**File:** packages/jazz-tools/src/tools/auth/AuthSecretStorage.ts (L91-111)
```typescript
  async get(): Promise<AuthCredentials | null> {
    const kvStore = KvStoreContext.getInstance().getStorage();
    const data = await kvStore.get(this.storageKey);

    if (!data) return null;

    const parsed = JSON.parse(data);

    if (!parsed.accountID || !parsed.accountSecret) {
      throw new Error("Invalid auth secret storage data");
    }

    return {
      accountID: parsed.accountID,
      secretSeed: parsed.secretSeed
        ? new Uint8Array(parsed.secretSeed)
        : undefined,
      accountSecret: parsed.accountSecret,
      provider: parsed.provider,
    };
  }
```

**File:** packages/jazz-tools/src/tools/auth/AuthSecretStorage.ts (L113-126)
```typescript
  async setWithoutNotify(payload: AuthSetPayload) {
    const kvStore = KvStoreContext.getInstance().getStorage();
    await kvStore.set(
      this.storageKey,
      JSON.stringify({
        accountID: payload.accountID,
        secretSeed: payload.secretSeed
          ? Array.from(payload.secretSeed)
          : undefined,
        accountSecret: payload.accountSecret,
        provider: payload.provider,
      }),
    );
  }
```

**File:** packages/jazz-tools/src/tools/implementation/createContext.ts (L87-156)
```typescript
export async function createJazzContextFromExistingCredentials<
  S extends
    | (AccountClass<Account> & CoValueFromRaw<Account>)
    | CoreAccountSchema,
>({
  credentials,
  peers,
  crypto,
  storage,
  AccountSchema: PropsAccountSchema,
  sessionProvider,
  onLogOut,
  asActiveAccount,
}: {
  credentials: Credentials;
  peers: Peer[];
  crypto: CryptoProvider;
  AccountSchema?: S;
  sessionProvider: SessionProvider;
  onLogOut?: () => void;
  storage?: StorageAPI;
  asActiveAccount: boolean;
}): Promise<JazzContextWithAccount<InstanceOfSchema<S>>> {
  const { sessionID, sessionDone } = await sessionProvider(
    credentials.accountID,
    crypto,
  );

  const CurrentAccountSchema =
    PropsAccountSchema ?? (RegisteredSchemas["Account"] as unknown as S);

  const AccountClass =
    coValueClassFromCoValueClassOrSchema(CurrentAccountSchema);

  const node = await LocalNode.withLoadedAccount({
    accountID: credentials.accountID as unknown as CoID<RawAccount>,
    accountSecret: credentials.secret,
    sessionID: sessionID,
    peers: peers,
    crypto: crypto,
    storage,
    migration: async (rawAccount, _node, creationProps) => {
      const account = AccountClass.fromRaw(rawAccount) as InstanceOfSchema<S>;
      if (asActiveAccount) {
        activeAccountContext.set(account);
      }

      await account.applyMigration(creationProps);
    },
  });

  const account = AccountClass.fromNode(node);
  if (asActiveAccount) {
    activeAccountContext.set(account);
  }

  return {
    node,
    account: account as InstanceOfSchema<S>,
    done: () => {
      node.gracefulShutdown();
      sessionDone();
    },
    logOut: async () => {
      node.gracefulShutdown();
      sessionDone();
      await onLogOut?.();
    },
  };
}
```

**File:** packages/jazz-tools/src/tools/implementation/createContext.ts (L256-286)
```typescript
  } else {
    const secretSeed = options.crypto.newRandomSecretSeed();

    const initialAgentSecret =
      options.newAccountProps?.secret ??
      crypto.agentSecretFromSecretSeed(secretSeed);

    const creationProps = options.newAccountProps?.creationProps ?? {
      name: options.defaultProfileName ?? "Anonymous user",
    };

    context = await createJazzContextForNewAccount({
      creationProps,
      initialAgentSecret,
      peers: options.peers,
      crypto,
      AccountSchema: options.AccountSchema,
      onLogOut: async () => {
        await authSecretStorage.clearWithoutNotify();
      },
      storage: options.storage,
    });

    if (!options.newAccountProps) {
      await authSecretStorage.setWithoutNotify({
        accountID: context.account.$jazz.id,
        secretSeed,
        accountSecret: context.node.getCurrentAgent().agentSecret,
        provider: "anonymous",
      });
    }
```

**File:** packages/jazz-tools/src/browser/createBrowserContext.ts (L172-236)
```typescript
export async function createJazzBrowserContext<
  S extends
    | (AccountClass<Account> & CoValueFromRaw<Account>)
    | AnyAccountSchema,
>(options: BrowserContextOptions<S>) {
  const {
    toggleNetwork,
    peers,
    setNode,
    crypto,
    storage,
    addConnectionListener,
    connected,
  } = await setupPeers(options);

  let unsubscribeAuthUpdate = () => {};

  if (options.sync.when === "signedUp") {
    const authSecretStorage = options.authSecretStorage;
    const credentials = options.credentials ?? (await authSecretStorage.get());

    function handleAuthUpdate(isAuthenticated: boolean) {
      if (isAuthenticated) {
        toggleNetwork(true);
      } else {
        toggleNetwork(false);
      }
    }

    unsubscribeAuthUpdate = authSecretStorage.onUpdate(handleAuthUpdate);
    handleAuthUpdate(authSecretStorage.getIsAuthenticated(credentials));
  }

  const context = await createJazzContext({
    credentials: options.credentials,
    newAccountProps: options.newAccountProps,
    peers,
    storage,
    crypto,
    defaultProfileName: options.defaultProfileName,
    AccountSchema: options.AccountSchema,
    sessionProvider: provideBrowserLockSession,
    authSecretStorage: options.authSecretStorage,
  });

  setNode(context.node);

  return {
    me: context.account,
    node: context.node,
    authSecretStorage: context.authSecretStorage,
    done: () => {
      // TODO: Sync all the covalues before closing the connection & context
      toggleNetwork(false);
      unsubscribeAuthUpdate();
      context.done();
    },
    logOut: () => {
      unsubscribeAuthUpdate();
      return context.logOut();
    },
    addConnectionListener,
    connected,
  };
}
```

**File:** packages/jazz-tools/src/tools/implementation/ContextManager.ts (L181-196)
```typescript
  logOut = async () => {
    if (!this.context || !this.props) {
      return;
    }

    this.authenticatingAccountID = null;

    await this.props.onLogOut?.();

    if (this.props.logOutReplacement) {
      await this.props.logOutReplacement();
    } else {
      await this.context.logOut();
      return this.createContext(this.props);
    }
  };
```

**File:** packages/jazz-tools/src/tools/implementation/ContextManager.ts (L221-265)
```typescript
  authenticate = async (credentials: AuthCredentials) => {
    if (!this.props) {
      throw new Error("Props required");
    }

    if (
      this.authenticatingAccountID &&
      this.authenticatingAccountID === credentials.accountID
    ) {
      console.info(
        "Authentication already in progress for account",
        credentials.accountID,
        "skipping duplicate request",
      );
      return;
    }

    if (
      this.authenticatingAccountID &&
      this.authenticatingAccountID !== credentials.accountID
    ) {
      throw new Error(
        `Authentication already in progress for different account (${this.authenticatingAccountID}), cannot authenticate ${credentials.accountID}`,
      );
    }

    this.authenticatingAccountID = credentials.accountID;

    try {
      const prevContext = this.context;
      const migratingAnonymousAccount =
        await this.shouldMigrateAnonymousAccount();

      this.keepContextOpen = migratingAnonymousAccount;
      await this.createContext(this.props, { credentials }).finally(() => {
        this.keepContextOpen = false;
      });

      if (migratingAnonymousAccount) {
        await this.handleAnonymousAccountMigration(prevContext);
      }
    } finally {
      this.authenticatingAccountID = null;
    }
  };
```

**File:** packages/jazz-tools/src/tools/implementation/ContextManager.ts (L311-356)
```typescript
  private async handleAnonymousAccountMigration(
    prevContext: PlatformSpecificContext<Acc> | undefined,
  ) {
    if (!this.props) {
      throw new Error("Props required");
    }

    const currentContext = this.context;

    if (
      prevContext &&
      currentContext &&
      "me" in prevContext &&
      "me" in currentContext
    ) {
      // Using a direct connection to make coValue transfer almost synchronous
      const [prevAccountAsPeer, currentAccountAsPeer] =
        cojsonInternals.connectedPeers(
          prevContext.me.$jazz.id,
          currentContext.me.$jazz.id,
          {
            peer1role: "client",
            peer2role: "server",
          },
        );

      // Closing storage on the prevContext to avoid conflicting transactions and getting stuck on waitForAllCoValuesSync
      // The storage is reachable through currentContext using the connectedPeers
      prevContext.node.removeStorage();

      currentContext.node.syncManager.addPeer(prevAccountAsPeer);
      prevContext.node.syncManager.addPeer(currentAccountAsPeer);

      try {
        await this.props.onAnonymousAccountDiscarded?.(prevContext.me);
        await prevContext.me.$jazz.waitForAllCoValuesSync();
      } catch (error) {
        console.error("Error onAnonymousAccountDiscarded", error);
      }

      prevAccountAsPeer.outgoing.close();
      currentAccountAsPeer.outgoing.close();
    }

    prevContext?.done();
  }
```

**File:** packages/cojson-transport-ws/src/createWebSocketPeer.ts (L104-115)
```typescript
  const pingTimeoutListener = createPingTimeoutListener(
    expectPings,
    pingTimeout,
    () => {
      incoming.push("Disconnected");
      logger.warn("Ping timeout from peer", {
        peerId: id,
        peerRole: role,
      });
      emitClosedEvent();
    },
  );
```

**File:** packages/jazz-tools/src/react-core/hooks.ts (L70-83)
```typescript
export function useIsAuthenticated() {
  const authSecretStorage = useAuthSecretStorage();

  return useSyncExternalStore(
    useCallback(
      (callback) => {
        return authSecretStorage.onUpdate(callback);
      },
      [authSecretStorage],
    ),
    () => authSecretStorage.isAuthenticated,
    () => authSecretStorage.isAuthenticated,
  );
}
```
