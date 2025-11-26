# Staging Deployment Checklist

This checklist covers deploying the Clerk-to-Passkey migration to a staging environment for testing before production deployment.

## Pre-Deployment Checklist

### 1. Code Preparation

- [ ] All changes committed to `clerk-to-passkey` branch
- [ ] Branch is up to date with `main`
- [ ] All tests passing locally (`pnpm test:run`)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] No TypeScript errors (`pnpm check`)

### 2. Environment Variables

Ensure staging environment has these variables configured:

```bash
# Jazz Configuration
PUBLIC_JAZZ_SYNC_SERVER=wss://cloud.jazz.tools/?key=YOUR_STAGING_API_KEY
NEXT_PUBLIC_JAZZ_API_KEY=YOUR_STAGING_API_KEY

# AI Assistant
GOOGLE_GENERATIVE_AI_API_KEY=your_staging_gemini_key

# Push Notifications
VAPID_PUBLIC_KEY=your_staging_vapid_public_key
VAPID_PRIVATE_KEY=your_staging_vapid_private_key
VAPID_SUBJECT=mailto:staging@yourdomain.com

# Cron Jobs (if enabled)
CRON_SECRET=staging_random_secret_string
```

**Note**: Use separate API keys for staging to isolate data from production.

### 3. Branch Management

```bash
# Ensure you're on the feature branch
git checkout clerk-to-passkey

# Pull latest changes
git pull origin clerk-to-passkey

# Check status
git status
```

## Deployment Steps

### Option A: Vercel Deployment

#### 1. Deploy to Staging

```bash
# Deploy to staging (creates preview deployment)
vercel

# Or deploy with specific environment
vercel --env staging
```

#### 2. Set Staging Environment Variables

```bash
# Set each variable for staging environment
vercel env add PUBLIC_JAZZ_SYNC_SERVER staging
vercel env add NEXT_PUBLIC_JAZZ_API_KEY staging
vercel env add GOOGLE_GENERATIVE_AI_API_KEY staging
vercel env add VAPID_PUBLIC_KEY staging
vercel env add VAPID_PRIVATE_KEY staging
vercel env add VAPID_SUBJECT staging
vercel env add CRON_SECRET staging
```

#### 3. Trigger Deployment

```bash
# Deploy to staging environment
vercel --env staging
```

### Option B: Manual Staging Server

#### 1. Build Application

```bash
# Build for production
pnpm build

# Or build for Node.js adapter
pnpm build:node
```

#### 2. Deploy to Staging Server

```bash
# Copy build artifacts to staging server
scp -r dist/ user@staging-server:/path/to/app/

# SSH into staging server
ssh user@staging-server

# Navigate to app directory
cd /path/to/app

# Install dependencies (if needed)
pnpm install --prod

# Start application
pm2 start dist/server/entry.mjs --name tilly-staging
```

## Post-Deployment Verification

### 1. Smoke Tests

#### Basic Functionality
- [ ] Application loads at staging URL
- [ ] No console errors on page load
- [ ] Service worker registers successfully
- [ ] Jazz sync connection establishes

#### Authentication Flow Tests
- [ ] **Sign Up Flow**
  - [ ] Click "Sign Up" button
  - [ ] Passkey creation prompt appears
  - [ ] Complete biometric authentication
  - [ ] User is logged in successfully
  - [ ] Profile data is created

- [ ] **Login Flow**
  - [ ] Log out from test account
  - [ ] Click "Log In" button
  - [ ] Passkey selection appears
  - [ ] Select existing passkey
  - [ ] Complete biometric authentication
  - [ ] User is logged in successfully
  - [ ] Previous data is accessible

- [ ] **Data Persistence**
  - [ ] Create a person
  - [ ] Add a note to the person
  - [ ] Create a reminder
  - [ ] Refresh the page
  - [ ] All data persists correctly

- [ ] **Cross-Device Sync** (if possible)
  - [ ] Log in on second device
  - [ ] Verify data syncs from first device
  - [ ] Make changes on second device
  - [ ] Verify changes sync to first device

### 2. Browser Console Checks

Open browser DevTools (F12) and check:

- [ ] **Console Tab**: No errors (red messages)
- [ ] **Network Tab**: 
  - [ ] WebSocket connection to Jazz sync server is established
  - [ ] No failed requests (except expected 404s)
- [ ] **Application Tab**:
  - [ ] Service worker is registered and active
  - [ ] IndexedDB contains Jazz data
  - [ ] LocalStorage contains auth credentials

### 3. Authentication State Tests

- [ ] **Anonymous State**
  - [ ] Open app in incognito/private window
  - [ ] Verify anonymous account is created
  - [ ] Create some test data
  - [ ] Sign up with passkey
  - [ ] Verify data is preserved after signup

- [ ] **Authenticated State**
  - [ ] User can access all features
  - [ ] Data syncs properly
  - [ ] Notifications can be enabled

- [ ] **Logout State**
  - [ ] Click logout
  - [ ] Verify user is logged out
  - [ ] Verify new anonymous account is created
  - [ ] Previous data is not accessible

### 4. Feature-Specific Tests

- [ ] **Person Management**
  - [ ] Create new person
  - [ ] Edit person details
  - [ ] Upload person avatar
  - [ ] Delete person

- [ ] **Notes**
  - [ ] Add note to person
  - [ ] Edit note
  - [ ] Delete note

- [ ] **Reminders**
  - [ ] Create reminder
  - [ ] Set due date
  - [ ] Mark as complete
  - [ ] Delete reminder

- [ ] **Settings**
  - [ ] Access settings page
  - [ ] Enable/disable notifications
  - [ ] Update notification preferences
  - [ ] Download data export
  - [ ] Upload data import

- [ ] **AI Assistant** (if enabled)
  - [ ] Open assistant
  - [ ] Send test message
  - [ ] Verify response
  - [ ] Check for errors

### 5. Performance Checks

- [ ] Page load time < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Smooth animations and transitions

### 6. Security Checks

- [ ] HTTPS is enforced
- [ ] Passkey creation requires secure context
- [ ] No sensitive data in console logs
- [ ] No sensitive data in network requests
- [ ] CORS headers are properly configured

## Rollback Procedure

If critical issues are found:

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [previous-deployment-url]
```

### Manual Server Rollback

```bash
# SSH into staging server
ssh user@staging-server

# Stop current deployment
pm2 stop tilly-staging

# Restore previous version
cd /path/to/app
git checkout [previous-commit-hash]
pnpm install
pnpm build

# Restart application
pm2 restart tilly-staging
```

## Issue Tracking

Document any issues found during staging testing:

### Critical Issues (Block Production)
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Major Issues (Should Fix Before Production)
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Minor Issues (Can Fix After Production)
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

## Sign-Off

Once all checks pass:

- [ ] All smoke tests completed successfully
- [ ] No critical or major issues found
- [ ] Performance is acceptable
- [ ] Security checks passed
- [ ] Stakeholders notified of staging deployment
- [ ] Ready for production deployment

**Tested By**: _______________  
**Date**: _______________  
**Staging URL**: _______________  
**Notes**: _______________

## Next Steps

After successful staging verification:

1. Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
2. Follow [Task 20: Deploy to production environment](../.kiro/specs/clerk-to-passkey-migration/tasks.md)
3. Monitor production deployment closely
4. Keep rollback procedure ready

## Additional Resources

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) - Authentication troubleshooting
- [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md) - Detailed testing procedures
- [ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md) - Emergency rollback procedures
