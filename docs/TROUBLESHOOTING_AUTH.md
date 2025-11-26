# Authentication Troubleshooting Guide

This guide helps you troubleshoot common authentication issues with Jazz Passkey authentication.

## Sign Out Issues

### Problem: "Log Out" button doesn't work

**Symptoms:**
- Clicking "Log out" does nothing
- User remains logged in after clicking logout
- Page doesn't refresh or redirect

**Causes:**
1. No internet connection (logout requires online access)
2. Browser local storage issues
3. Service worker cache issues
4. Jazz sync connection problems

**Solutions:**

#### Solution 1: Check Internet Connection

Logout requires an active internet connection to properly clear the Jazz authentication state.

1. Verify you're online
2. Try again when connection is restored
3. If offline, you'll see a message indicating internet is required

#### Solution 2: Clear Browser Local Storage

If logout still doesn't work:

1. Open browser DevTools (F12 or right-click → Inspect)
2. Go to **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
3. Expand **Local Storage** in the left sidebar
4. Click on your Tilly domain (e.g., `https://tilly.social`)
5. Look for keys starting with `jazz-` (e.g., `jazz-logged-in-secret`)
6. Right-click and delete these entries
7. Refresh the page

**Chrome/Edge:**
```
DevTools → Application → Local Storage → [your-domain] → Delete jazz-* keys
```

**Firefox:**
```
DevTools → Storage → Local Storage → [your-domain] → Delete jazz-* keys
```

**Safari:**
```
DevTools → Storage → Local Storage → [your-domain] → Delete jazz-* keys
```

#### Solution 3: Clear Service Worker Cache

Service workers can cache authentication state:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** next to the Tilly service worker
5. Go to **Cache Storage**
6. Delete all Tilly-related caches
7. Refresh the page

#### Solution 4: Clear All Site Data

If the above doesn't work, clear all site data:

**Chrome/Edge:**
1. Click the lock icon in the address bar
2. Click "Site settings"
3. Scroll down and click "Clear data"
4. Confirm and refresh

**Firefox:**
1. Click the lock icon in the address bar
2. Click "Clear cookies and site data"
3. Confirm and refresh

**Safari:**
1. Safari → Settings → Privacy
2. Click "Manage Website Data"
3. Find and remove Tilly
4. Refresh

#### Solution 5: Force Logout via Console

As a last resort, force logout via browser console:

1. Open DevTools (F12)
2. Go to **Console** tab
3. Paste and run:
```javascript
// Clear Jazz authentication
localStorage.removeItem('jazz-logged-in-secret');
// Clear all Jazz-related storage
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('jazz-')) {
    localStorage.removeItem(key);
  }
});
// Reload page
window.location.reload();
```

## Sign In Issues

### Problem: Cannot sign in with passkey

**Symptoms:**
- Passkey prompt doesn't appear
- "Authentication failed" error
- Passkey not recognized

**Solutions:**

#### Solution 1: Check Browser Support

Ensure your browser supports WebAuthn:
- Chrome/Edge 67+
- Firefox 60+
- Safari 13+

Check support at: https://caniuse.com/webauthn

#### Solution 2: Check Device Support

Verify your device has biometric authentication:
- **iOS/macOS**: FaceID or TouchID enabled
- **Windows**: Windows Hello configured
- **Android**: Fingerprint or face unlock enabled

#### Solution 3: Try Different Authentication Method

If biometric doesn't work:
1. Try using a security key (YubiKey, etc.)
2. Try using device PIN/password as fallback
3. Try on a different device

#### Solution 4: Clear Passkey and Re-register

If your passkey is corrupted:

**Chrome/Edge:**
1. Settings → Privacy and security → Security
2. Click "Manage passkeys"
3. Find and delete Tilly passkey
4. Return to Tilly and sign up again

**Safari:**
1. System Settings → Passwords
2. Find Tilly passkey
3. Delete it
4. Return to Tilly and sign up again

**Windows:**
1. Settings → Accounts → Sign-in options
2. Click "Passkeys"
3. Find and remove Tilly passkey
4. Return to Tilly and sign up again

### Problem: "Passkey creation failed"

**Symptoms:**
- Error during sign-up
- Passkey prompt appears but fails
- "User verification failed" error

**Solutions:**

#### Solution 1: Verify Biometric Setup

Ensure biometric authentication is properly configured:
- Test FaceID/TouchID in another app
- Re-enroll biometric if needed
- Check device settings for biometric authentication

#### Solution 2: Check Browser Permissions

Ensure browser has permission to access biometric:
1. Check site permissions in browser settings
2. Allow "Use your device's authentication" if prompted
3. Try in a different browser

#### Solution 3: Use HTTPS

Passkeys require a secure context:
- Ensure you're using HTTPS (not HTTP)
- `localhost` is allowed for development
- Self-signed certificates may cause issues

#### Solution 4: Disable Browser Extensions

Some extensions interfere with WebAuthn:
1. Disable all extensions
2. Try passkey creation again
3. Re-enable extensions one by one to find culprit

## Data Access Issues

### Problem: Cannot access data after login

**Symptoms:**
- Logged in but see empty state
- "Loading..." never completes
- Data appears then disappears

**Solutions:**

#### Solution 1: Check Sync Connection

Verify Jazz sync is working:
1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Look for connection to `cloud.jazz.tools`
4. Check connection status (should be green/connected)

#### Solution 2: Wait for Sync

Initial sync can take time:
1. Wait 30-60 seconds for data to sync
2. Check network connection
3. Try refreshing the page

#### Solution 3: Verify Account

Ensure you're logged into the correct account:
1. Go to Settings
2. Check authentication status
3. Verify account name/email
4. If wrong account, log out and log in with correct passkey

#### Solution 4: Check Data Ownership

If you migrated from Clerk:
1. Verify you imported your data export
2. Check that import completed successfully
3. Try importing again if needed

## Cross-Device Issues

### Problem: Cannot access account on new device

**Symptoms:**
- Passkey not available on new device
- "No passkeys found" error
- Cannot log in on second device

**Solutions:**

#### Solution 1: Check Passkey Sync

Verify passkeys are syncing:

**Apple devices:**
- Ensure iCloud Keychain is enabled
- Settings → [Your Name] → iCloud → Passwords and Keychain
- Both devices must be signed into same iCloud account

**Android/Chrome:**
- Ensure Google Password Manager is enabled
- Settings → Google → Autofill → Password Manager
- Both devices must be signed into same Google account

**Windows:**
- Ensure Microsoft Account sync is enabled
- Settings → Accounts → Windows backup
- Both devices must use same Microsoft account

#### Solution 2: Use Cross-Device Authentication

If passkey isn't synced:
1. On new device, click "Log in"
2. Select "Use a phone, tablet, or security key"
3. Scan QR code with device that has passkey
4. Complete authentication on original device

#### Solution 3: Create New Passkey

If cross-device doesn't work:
1. Export your data from original device
2. Create new passkey on new device
3. Import your data
4. Now you have passkeys on both devices

## Performance Issues

### Problem: Slow authentication

**Symptoms:**
- Passkey prompt takes long to appear
- Login process is slow
- App freezes during authentication

**Solutions:**

#### Solution 1: Check Network Speed

Slow network affects authentication:
1. Test internet speed
2. Try on faster connection
3. Wait for better connectivity

#### Solution 2: Clear Browser Cache

Cached data can slow things down:
1. Clear browser cache
2. Clear service worker cache
3. Refresh and try again

#### Solution 3: Restart Browser

Sometimes browser needs restart:
1. Close all browser windows
2. Reopen browser
3. Try authentication again

## Security Issues

### Problem: "Authentication failed" or "Invalid credentials"

**Symptoms:**
- Passkey prompt succeeds but login fails
- "Invalid credentials" error
- "Authentication failed" message

**Solutions:**

#### Solution 1: Verify Passkey

Ensure passkey is valid:
1. Check passkey exists in device settings
2. Verify it's for correct domain
3. Try deleting and recreating passkey

#### Solution 2: Check Time Sync

Authentication requires accurate time:
1. Verify device time is correct
2. Enable automatic time sync
3. Restart device if time was wrong

#### Solution 3: Clear Corrupted State

If authentication state is corrupted:
1. Clear local storage (see above)
2. Clear service worker cache
3. Refresh page
4. Try authentication again

## Getting Help

If none of these solutions work:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Take screenshot of errors

2. **Check Network Tab**
   - Open DevTools → Network
   - Try authentication again
   - Look for failed requests
   - Take screenshot of failures

3. **File an Issue**
   - Go to GitHub repository
   - Create new issue
   - Include:
     - Browser and version
     - Device and OS
     - Steps to reproduce
     - Screenshots of errors
     - Console logs

4. **Contact Support**
   - Email: assmann@hey.com
   - Include all information from above
   - Describe what you've already tried

## Prevention

To avoid authentication issues:

1. **Keep Browser Updated**
   - Use latest browser version
   - Enable automatic updates

2. **Backup Your Data**
   - Regularly export data (Settings → Download Data)
   - Store exports securely
   - Test imports periodically

3. **Use Multiple Devices**
   - Set up passkeys on 2+ devices
   - Ensures access if one device fails
   - Passkeys sync automatically

4. **Monitor Sync Status**
   - Check connection indicator in app
   - Verify data syncs across devices
   - Report sync issues promptly

## Related Documentation

- [Migration Guide](MIGRATION_GUIDE.md) - Migrating from Clerk
- [Deployment Guide](DEPLOYMENT.md) - Self-hosting setup
- [Authentication Testing](AUTHENTICATION_TESTING.md) - Testing auth flows
- [Security Review](SECURITY_REVIEW.md) - Security considerations
