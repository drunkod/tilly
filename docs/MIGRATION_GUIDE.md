# Migration Guide: Clerk to Jazz Passkey Authentication

This guide helps existing Tilly users migrate from Clerk authentication to Jazz's native Passkey authentication.

## What's Changing

Tilly is migrating from Clerk (third-party authentication) to Jazz's built-in Passkey authentication system. This change:

- **Simplifies the stack** - One less external dependency
- **Improves security** - Passkeys are phishing-resistant and use biometric authentication
- **Reduces costs** - No Clerk subscription needed
- **Maintains privacy** - Your data remains encrypted end-to-end

## Important: Data Migration Required

⚠️ **Your existing account cannot be automatically migrated.** You will need to:

1. Export your data from your current Tilly account
2. Create a new account with Passkey authentication
3. Import your data into the new account

## Migration Steps

### Step 1: Export Your Data

Before the migration:

1. Log in to your current Tilly account
2. Go to Settings
3. Click "Download Data" to export your data as JSON
4. Save the file securely on your device

### Step 2: Update Tilly

If self-hosting:

```bash
git pull origin main
pnpm install
pnpm build
```

If using tilly.social, the update will be automatic.

### Step 3: Create New Account

1. Open Tilly (you'll be logged out automatically)
2. Click "Sign Up" to create a new account
3. Enter your name when prompted
4. Follow your browser's passkey creation flow:
   - **iOS/macOS**: Use FaceID or TouchID
   - **Windows**: Use Windows Hello or security key
   - **Android**: Use fingerprint or device unlock

### Step 4: Import Your Data

1. Log in to your new account
2. Go to Settings
3. Click "Upload Data"
4. Select the JSON file you exported in Step 1
5. Wait for the import to complete

### Step 5: Verify Your Data

Check that all your:
- People and their information
- Notes and memories
- Reminders and notifications
- Settings and preferences

...have been imported correctly.

## Understanding Passkeys

### What is a Passkey?

A passkey is a secure, passwordless authentication method that uses:
- Your device's biometric sensors (FaceID, TouchID, fingerprint)
- Or a security key (YubiKey, etc.)
- Or your device's PIN/password as a fallback

### Benefits

- **More secure**: Phishing-resistant, no password to steal
- **More convenient**: Just use your fingerprint or face
- **Cross-device**: Syncs through your browser/OS (iCloud Keychain, Google Password Manager)

### Browser Support

Passkeys work in:
- Chrome/Edge (Windows, macOS, Android)
- Safari (iOS, macOS)
- Firefox (Windows, macOS, Linux)

### Multi-Device Access

Your passkey automatically syncs across devices that share the same:
- **Apple devices**: iCloud Keychain
- **Android/Chrome**: Google Password Manager
- **Windows**: Microsoft Account

To use Tilly on a device without your passkey:
1. Use your phone to scan a QR code (cross-device authentication)
2. Or create a new passkey on that device

## Troubleshooting

### "Passkey creation failed"

- Ensure you're using a supported browser
- Check that your device supports biometric authentication
- Try using a security key instead
- Clear browser cache and try again

### "Cannot import data"

- Verify the JSON file is not corrupted
- Check that you're logged in to the new account
- Try importing in smaller batches if you have a lot of data

### "Lost access to my passkey"

If you lose access to your passkey:
- Check if it's synced to other devices (iCloud, Google, Microsoft)
- If not, you'll need to create a new account and re-import your data
- **Important**: Always keep a recent data export as backup

## Rollback (Self-Hosted Only)

If you need to rollback to Clerk authentication:

1. Checkout the previous version:
```bash
git checkout <previous-commit-hash>
pnpm install
```

2. Restore your Clerk environment variables in `.env`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

3. Rebuild and restart:
```bash
pnpm build
pnpm dev
```

## Support

If you encounter issues during migration:

- Check the [troubleshooting section](#troubleshooting) above
- Review [docs/AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md) for common issues
- File an issue on GitHub with details about your problem
- Email support: assmann@hey.com

## FAQ

**Q: Can I keep using Clerk?**
A: No, Clerk support has been removed. You must migrate to Passkey authentication.

**Q: What happens to my old Clerk account?**
A: Your Clerk account and its data remain unchanged. You can delete it after successfully migrating.

**Q: Can I use the same email address?**
A: Yes, passkeys are not tied to email addresses. You can use any name during signup.

**Q: Is my data still encrypted?**
A: Yes, your data remains end-to-end encrypted. The encryption keys are now derived from your passkey instead of being stored with Clerk.

**Q: What if I don't have biometric authentication?**
A: You can use a security key (like YubiKey) or your device's PIN/password as alternatives.

**Q: Can I export my data anytime?**
A: Yes, you can export your data at any time from Settings → Download Data.
