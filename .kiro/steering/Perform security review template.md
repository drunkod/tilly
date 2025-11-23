---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
# Security Analysis of `/starters/react-passkey-auth` and Jazz Cryptographic Implementation

## Passkey Implementation Security

The passkey authentication in Jazz uses the **WebAuthn API** with robust security measures:

**Passkey Creation and Authentication:** The implementation uses WebAuthn's `navigator.credentials.create()` and `navigator.credentials.get()` APIs with secure configurations. [1](#10-0) 

The passkey stores both the secret seed and account ID in the `userHandle`, which is securely managed by the authenticator device. [2](#10-1) 

**Key Security Features:**
- Requires resident keys (`requireResidentKey: true`)
- Uses `userVerification: "preferred"` for biometric/PIN verification
- Challenge-based authentication with cryptographically secure random bytes
- Multiple algorithm support (Ed25519, RSA, ECDSA) [3](#10-2) 

**Login Flow:** During login, credentials are extracted from the WebAuthn response and used to derive the agent secret. [4](#10-3) 

## Local Storage Security

**Storage Implementation:** Jazz uses browser `localStorage` for persisting authentication credentials through the `LocalStorageKVStore` class. [5](#10-4) 

**Credential Storage:** Authentication secrets are stored in localStorage under the key `"jazz-logged-in-secret"` with the account ID, secret seed, account secret, and provider information serialized as JSON. [6](#10-5) 

**Security Considerations:**
- localStorage is vulnerable to XSS attacks since JavaScript can access it
- The example does NOT use `httpOnly` cookies or secure storage mechanisms
- For mobile platforms, Jazz provides `ExpoSecureStoreAdapter` which uses platform keychain storage with encryption [7](#10-6) 

## XSS Vulnerability Protection

**Limited Built-in Protection:** The codebase does **NOT** implement explicit XSS sanitization or protection mechanisms. 

**React's Default Protection:** The example relies on React's default XSS protection through JSX, which automatically escapes values rendered in the DOM. User input is handled through controlled components: [8](#10-7) 

**No Dangerous Patterns:** The codebase search revealed no usage of `dangerouslySetInnerHTML`, `eval()`, or other dangerous patterns in the starter example.

**Input Handling:** User input from forms is directly passed to Jazz's data layer without sanitization, relying on React's built-in escaping when rendering. [9](#10-8) 

## CSP Headers

**No CSP Implementation:** The react-passkey-auth starter does **NOT** implement Content-Security-Policy headers. The HTML file is minimal with no security headers: [10](#10-9) 

The Vite configuration is also basic with no security header plugins configured. [11](#10-10) 

## User Input Sanitization

**No Explicit Sanitization:** There is no input validation or sanitization implemented in the example. User input flows directly into the data model: [12](#10-11) 

The only validation present is in the `AuthSecretStorage` constructor, which validates the storage key is a non-empty string using Zod. [13](#10-12) 

## Cryptographic Secrets Generation and Security

### Secret Generation

**Cryptographically Secure Random Generation:** Jazz uses the browser's `crypto.getRandomValues()` API for all random number generation, which provides cryptographically secure randomness: [14](#10-13) 

**Secret Seed Generation:** Account secrets start with a 32-byte random seed: [15](#10-14) 

**Agent Secret Derivation:** From the secret seed, Jazz derives both sealing and signing keys using BLAKE3 with context strings ("seal" and "sign") to ensure key separation: [16](#10-15) 

### Cryptographic Implementation

**Dual Implementation Strategy:** Jazz provides both WebAssembly (WasmCrypto) and pure JavaScript (PureJSCrypto) implementations for fallback compatibility:

- **Primary (WASM):** Uses the `cojson-core-wasm` module for optimal performance [17](#10-16) 
- **Fallback (Pure JS):** Uses `@noble/curves` and `@noble/ciphers` libraries [18](#10-17) 

**Cryptographic Algorithms:**
- **Signing:** Ed25519 for digital signatures
- **Encryption:** XSalsa20 for symmetric encryption
- **Authenticated Encryption:** X25519 + XSalsa20-Poly1305 for sealing/unsealing
- **Hashing:** BLAKE3 for all hashing operations

### Secret Validation

**Length Validation:** Secret seeds must be exactly 32 bytes: [19](#10-18) 

**Authentication Flow Validation:** During authentication, credentials are validated to ensure they contain required fields (accountID and accountSecret): [20](#10-19) 

**Concurrent Authentication Prevention:** The authentication system prevents concurrent authentication attempts for different accounts: [21](#10-20) 

## Notes

### Security Strengths:
1. **Strong Passkey Implementation** using WebAuthn standard with proper configuration
2. **Cryptographically Secure RNG** using browser's native crypto API
3. **Well-designed Key Derivation** using BLAKE3 with context separation
4. **Proven Cryptographic Libraries** (@noble/curves, @noble/ciphers for fallback)
5. **Account Migration Handling** to prevent security issues during authentication state changes

### Security Weaknesses and Risks:
1. **No XSS Protection:** Relies entirely on React's default escaping; no explicit sanitization
2. **No CSP Headers:** Application is vulnerable to script injection attacks
3. **localStorage for Secrets:** Authentication secrets stored in localStorage are vulnerable to XSS attacks—any malicious script can access them
4. **No Input Validation:** User input is not validated or sanitized before storage
5. **No Rate Limiting:** No protection against brute force or automated attacks
6. **No Security Headers:** Missing security-critical HTTP headers like CSP, X-Frame-Options, etc.

### Recommendations:
- Consider using `sessionStorage` or encrypted IndexedDB instead of localStorage
- Implement CSP headers to prevent script injection
- Add input validation and sanitization layers
- Implement rate limiting for authentication attempts
- Add security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Consider using secure cookies with `httpOnly` and `sameSite` flags for session management

The passkey and cryptographic implementations are strong, but the overall application security depends heavily on proper deployment configuration and additional security layers not present in this minimal starter example.

### Citations

**File:** packages/jazz-tools/src/browser/auth/PasskeyAuth.ts (L40-60)
```typescript
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
```

**File:** packages/jazz-tools/src/browser/auth/PasskeyAuth.ts (L112-121)
```typescript
    const webAuthNCredentialPayload = new Uint8Array(
      cojsonInternals.secretSeedLength + cojsonInternals.shortHashLength,
    );

    webAuthNCredentialPayload.set(secretSeed);
    webAuthNCredentialPayload.set(
      cojsonInternals.rawCoIDtoBytes(accountID as unknown as RawAccountID),
      cojsonInternals.secretSeedLength,
    );

```

**File:** packages/jazz-tools/src/browser/auth/PasskeyAuth.ts (L123-153)
```typescript
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
  }
```

**File:** packages/jazz-tools/src/browser/auth/LocalStorageKVStore.ts (L1-21)
```typescript
import { KvStore } from "jazz-tools";

export class LocalStorageKVStore implements KvStore {
  constructor() {}

  async get(key: string) {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  async delete(key: string) {
    localStorage.removeItem(key);
  }

  async clearAll() {
    localStorage.clear();
  }
}
```

**File:** packages/jazz-tools/src/tools/auth/AuthSecretStorage.ts (L28-33)
```typescript
  constructor(private storageKey: string = STORAGE_KEY) {
    z.string().nonempty().parse(storageKey);

    this.listeners = new Set();
    this.isAuthenticated = false;
  }
```

**File:** packages/jazz-tools/src/tools/auth/AuthSecretStorage.ts (L99-101)
```typescript
    if (!parsed.accountID || !parsed.accountSecret) {
      throw new Error("Invalid auth secret storage data");
    }
```

**File:** packages/jazz-tools/src/tools/auth/AuthSecretStorage.ts (L115-126)
```typescript
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

**File:** packages/jazz-tools/src/expo/storage/expo-secure-store-adapter.ts (L4-16)
```typescript
export class ExpoSecureStoreAdapter implements KvStore {
  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key, {
      requireAuthentication: false,
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  }

  async set(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value, {
      requireAuthentication: false,
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
```

**File:** starters/react-passkey-auth/src/Form.tsx (L11-44)
```typescript
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
```

**File:** starters/react-passkey-auth/src/AuthButton.tsx (L125-135)
```typescript

```

**File:** starters/react-passkey-auth/index.html (L1-13)
```html
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
```

**File:** starters/react-passkey-auth/vite.config.ts (L1-7)
```typescript
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

**File:** packages/cojson/src/crypto/crypto.ts (L14-16)
```typescript
function randomBytes(bytesLength = 32): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(bytesLength));
}
```

**File:** packages/cojson/src/crypto/crypto.ts (L229-231)
```typescript
  newRandomSecretSeed(): Uint8Array {
    return this.randomBytes(secretSeedLength);
  }
```

**File:** packages/cojson/src/crypto/crypto.ts (L233-247)
```typescript
  agentSecretFromSecretSeed(secretSeed: Uint8Array): AgentSecret {
    if (secretSeed.length !== secretSeedLength) {
      throw new Error(`Secret seed needs to be ${secretSeedLength} bytes long`);
    }

    return `sealerSecret_z${base58.encode(
      this.blake3HashOnceWithContext(secretSeed, {
        context: textEncoder.encode("seal"),
      }),
    )}/signerSecret_z${base58.encode(
      this.blake3HashOnceWithContext(secretSeed, {
        context: textEncoder.encode("sign"),
      }),
    )}`;
  }
```

**File:** packages/cojson/src/crypto/WasmCrypto.ts (L48-77)
```typescript
/**
 * WebAssembly implementation of the CryptoProvider interface using cojson-core-wasm.
 * This provides the primary implementation using WebAssembly for optimal performance, offering:
 * - Signing/verifying (Ed25519)
 * - Encryption/decryption (XSalsa20)
 * - Sealing/unsealing (X25519 + XSalsa20-Poly1305)
 * - Hashing (BLAKE3)
 */
export class WasmCrypto extends CryptoProvider<Blake3State> {
  private constructor() {
    super();
  }

  static setInit(value: typeof initialize) {
    wasmInit = value;
  }

  static async create(): Promise<WasmCrypto | PureJSCrypto> {
    try {
      await wasmInit();
    } catch (e) {
      logger.warn(
        "Failed to initialize WasmCrypto, falling back to PureJSCrypto",
        { err: e },
      );
      return new PureJSCrypto();
    }

    return new WasmCrypto();
  }
```

**File:** packages/cojson/src/crypto/PureJSCrypto.ts (L57-68)
```typescript
/**
 * Pure JavaScript implementation of the CryptoProvider interface using noble-curves and noble-ciphers libraries.
 * This provides a fallback implementation that doesn't require WebAssembly, offering:
 * - Signing/verifying (Ed25519)
 * - Encryption/decryption (XSalsa20)
 * - Sealing/unsealing (X25519 + XSalsa20-Poly1305)
 * - Hashing (BLAKE3)
 */
export class PureJSCrypto extends CryptoProvider<Blake3State> {
  static async create(): Promise<PureJSCrypto> {
    return new PureJSCrypto();
  }
```

**File:** packages/jazz-tools/src/tools/implementation/ContextManager.ts (L238-245)
```typescript
    if (
      this.authenticatingAccountID &&
      this.authenticatingAccountID !== credentials.accountID
    ) {
      throw new Error(
        `Authentication already in progress for different account (${this.authenticatingAccountID}), cannot authenticate ${credentials.accountID}`,
      );
    }
```
