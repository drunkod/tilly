# Rollback Procedures

This document provides step-by-step procedures for rolling back the Clerk to Jazz Passkey authentication migration if issues arise.

## When to Rollback

Consider rolling back if you encounter:

- **Critical authentication failures** preventing user access
- **Data loss or corruption** affecting user data
- **Unacceptable user experience degradation** (e.g., >50% of users unable to authenticate)
- **Security vulnerabilities** discovered in the new authentication system
- **Performance issues** making the app unusable

## Pre-Rollback Checklist

Before initiating a rollback:

- [ ] Document the issue(s) requiring rollback
- [ ] Notify users of temporary service disruption (if applicable)
- [ ] Backup current database state
- [ ] Verify Clerk credentials are still valid
- [ ] Ensure you have access to previous Git commit
- [ ] Review impact on users currently using Passkey auth

## Rollback Procedures

### For Self-Hosted Deployments

#### Step 1: Identify Rollback Point

```bash
# View recent commits
git log --oneline -10

# Find the commit before Passkey migration
# Look for commit message like "Migrate from Clerk to Passkey authentication"
```

#### Step 2: Checkout Previous Version

```bash
# Create a rollback branch
git checkout -b rollback-to-clerk

# Revert to commit before migration
git revert <migration-commit-hash>

# Or hard reset (use with caution)
git reset --hard <commit-before-migration>
```

#### Step 3: Restore Clerk Configuration

Create or update `.env` with Clerk credentials:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Keep existing Jazz configuration
PUBLIC_JAZZ_SYNC_SERVER=wss://cloud.jazz.tools/?key=YOUR_KEY
NEXT_PUBLIC_JAZZ_API_KEY=YOUR_KEY

# Other existing variables
GOOGLE_GENERATIVE_AI_API_KEY=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=...
CRON_SECRET=...
```

#### Step 4: Reinstall Dependencies

```bash
# Remove node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstall with Clerk packages
pnpm install
```

#### Step 5: Rebuild Application

```bash
# Clean build artifacts
rm -rf .next dist

# Rebuild
pnpm build
```

#### Step 6: Verify Rollback

```bash
# Start development server
pnpm dev

# Test in browser:
# 1. Visit http://localhost:4321
# 2. Verify Clerk sign-in appears
# 3. Test authentication flow
# 4. Verify data access works
```

#### Step 7: Deploy Rollback

```bash
# Push rollback branch
git push origin rollback-to-clerk

# Deploy to production
vercel --prod
# or your deployment command
```

### For Vercel Deployments

#### Option A: Instant Rollback (Recommended)

```bash
# List recent deployments
vercel ls

# Find deployment before migration
# Look for deployment timestamp before migration date

# Rollback to specific deployment
vercel rollback <deployment-url>
```

#### Option B: Redeploy Previous Version

1. Go to Vercel Dashboard
2. Navigate to your project
3. Click "Deployments" tab
4. Find deployment before migration
5. Click "..." menu → "Promote to Production"

#### Option C: Git-Based Rollback

```bash
# Revert migration commit
git revert <migration-commit-hash>

# Push to trigger new deployment
git push origin main
```

### For Docker Deployments

#### Step 1: Stop Current Container

```bash
# Stop running container
docker stop tilly

# Remove container
docker rm tilly
```

#### Step 2: Pull Previous Image

```bash
# If you tagged previous version
docker pull tilly:pre-passkey-migration

# Or rebuild from previous commit
git checkout <commit-before-migration>
docker build -t tilly:rollback .
```

#### Step 3: Update Environment Variables

Create `docker.env` with Clerk credentials:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
PUBLIC_JAZZ_SYNC_SERVER=wss://cloud.jazz.tools/?key=YOUR_KEY
# ... other variables
```

#### Step 4: Start Rolled-Back Container

```bash
docker run -d \
  --name tilly \
  --env-file docker.env \
  -p 3000:3000 \
  tilly:rollback
```

## Post-Rollback Steps

### 1. Verify System Health

- [ ] Test Clerk authentication (sign up, sign in, sign out)
- [ ] Verify data access and sync
- [ ] Check push notifications
- [ ] Test AI assistant
- [ ] Monitor error logs

### 2. Restore Clerk Webhooks

If you disabled Clerk webhooks during migration:

1. Go to Clerk Dashboard → Webhooks
2. Re-enable webhook endpoints
3. Verify webhook secret in `.env`
4. Test webhook delivery

### 3. Re-enable Cron Jobs

Update `vercel.json` to re-enable push notification cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/push-notifications",
      "schedule": "0 * * * *"
    }
  ]
}
```

### 4. Communicate with Users

**For users who migrated to Passkey:**

```
Subject: Temporary Rollback to Previous Authentication

We've temporarily rolled back to our previous authentication system 
to address [brief issue description].

What this means for you:
- If you created a Passkey account, you'll need to sign in with 
  your original Clerk account
- Your data is safe and will be accessible after signing in
- We're working to resolve the issues and will migrate again soon

We apologize for the inconvenience.
```

**For users still on Clerk:**

```
Subject: Service Restored

Our authentication system has been restored to normal operation.
You can continue using Tilly as usual.

Thank you for your patience.
```

### 5. Document Issues

Create a post-mortem document:

```markdown
# Rollback Post-Mortem

## Date
[Date of rollback]

## Issue Summary
[Brief description of what went wrong]

## Timeline
- [Time]: Migration deployed
- [Time]: Issue first detected
- [Time]: Rollback initiated
- [Time]: Service restored

## Root Cause
[Detailed explanation of what caused the issue]

## Impact
- Users affected: [number/percentage]
- Duration: [time]
- Data loss: [yes/no, details]

## Resolution
[How the rollback was performed]

## Lessons Learned
[What we learned from this incident]

## Action Items
- [ ] Fix root cause
- [ ] Add tests to prevent recurrence
- [ ] Update migration procedure
- [ ] Improve monitoring
```

## Data Migration Considerations

### Users Who Migrated to Passkey

Users who created Passkey accounts during the migration period will need to:

1. **Export their data** from Passkey account (if possible)
2. **Sign in with Clerk** account
3. **Import their data** back to Clerk account

Provide a data migration tool:

```typescript
// scripts/migrate-passkey-to-clerk.ts
async function migratePasskeyDataToClerk(
  passkeyExport: string,
  clerkUserId: string
) {
  // Load exported data
  const data = JSON.parse(passkeyExport);
  
  // Import to Clerk account
  await importUserData(clerkUserId, data);
  
  console.log('Migration complete');
}
```

### Data Integrity Checks

After rollback, verify:

```bash
# Run data integrity checks
pnpm tsx scripts/verify-data-integrity.ts

# Check for:
# - Orphaned records
# - Missing relationships
# - Corrupted data
# - Duplicate entries
```

## Monitoring After Rollback

### Key Metrics to Watch

1. **Authentication Success Rate**
   - Should return to pre-migration levels
   - Monitor for 24-48 hours

2. **Error Rates**
   - Should decrease significantly
   - Watch for new errors introduced by rollback

3. **User Activity**
   - Monitor daily active users
   - Check for drop-off after rollback

4. **Performance**
   - Response times should normalize
   - Database query performance

### Alerting

Set up alerts for:

```javascript
// Example alert conditions
{
  "auth_failure_rate": "> 5%",
  "error_rate": "> 1%",
  "response_time_p95": "> 2s",
  "active_users": "< 80% of baseline"
}
```

## Prevention for Next Migration

### Pre-Migration Checklist

- [ ] Comprehensive testing in staging environment
- [ ] Gradual rollout plan (e.g., 10% → 50% → 100%)
- [ ] Feature flags for easy rollback
- [ ] Automated rollback triggers
- [ ] Clear rollback procedures documented
- [ ] User communication plan prepared
- [ ] Data migration tools tested
- [ ] Monitoring and alerting configured

### Gradual Rollout Strategy

For next migration attempt:

```typescript
// Feature flag for gradual rollout
const PASSKEY_ROLLOUT_PERCENTAGE = 10; // Start with 10%

function shouldUsePasskeyAuth(userId: string): boolean {
  // Hash user ID to get consistent assignment
  const hash = hashUserId(userId);
  return (hash % 100) < PASSKEY_ROLLOUT_PERCENTAGE;
}
```

### Automated Rollback Triggers

```typescript
// Monitor key metrics and auto-rollback if thresholds exceeded
async function monitorAndRollback() {
  const metrics = await getMetrics();
  
  if (
    metrics.authFailureRate > 0.1 || // 10% failure rate
    metrics.errorRate > 0.05 ||      // 5% error rate
    metrics.activeUsers < 0.7        // 30% drop in users
  ) {
    console.error('Metrics exceeded thresholds, initiating rollback');
    await initiateAutomatedRollback();
  }
}
```

## Support During Rollback

### User Support

Prepare support team with:

1. **FAQ document** addressing common rollback questions
2. **Step-by-step guides** for users to access their data
3. **Escalation procedures** for critical issues
4. **Communication templates** for consistent messaging

### Developer Support

Ensure development team has:

1. **Access to rollback procedures** (this document)
2. **Deployment credentials** for emergency rollback
3. **Monitoring dashboards** to track rollback progress
4. **Communication channels** for coordination

## Testing Rollback Procedure

Periodically test rollback procedure in staging:

```bash
# Staging rollback test
1. Deploy Passkey migration to staging
2. Create test data with Passkey auth
3. Perform rollback following this guide
4. Verify Clerk auth works
5. Verify data integrity
6. Document any issues or improvements
```

## Contact Information

For rollback assistance:

- **Primary**: assmann@hey.com
- **GitHub Issues**: [Create issue](https://github.com/ccssmnn/tilly/issues)
- **Emergency**: [Your emergency contact]

## Appendix: Common Rollback Issues

### Issue: Clerk Credentials Invalid

**Symptom**: "Invalid API key" errors after rollback

**Solution**:
1. Verify credentials in Clerk Dashboard
2. Regenerate keys if needed
3. Update `.env` file
4. Restart application

### Issue: Database Schema Mismatch

**Symptom**: Database errors after rollback

**Solution**:
1. Check for schema migrations that ran during Passkey period
2. Rollback database migrations if needed
3. Verify data structure matches Clerk version

### Issue: Users Can't Access Data

**Symptom**: Users see empty state after rollback

**Solution**:
1. Verify user ID mapping between Clerk and Jazz
2. Check data ownership and permissions
3. Run data integrity checks
4. Manually restore user data if needed

### Issue: Cron Jobs Not Running

**Symptom**: Push notifications not being sent

**Solution**:
1. Verify `vercel.json` cron configuration
2. Check cron secret is set correctly
3. Test cron endpoint manually
4. Review cron job logs

## Version History

- **v1.0** (2025-01-XX): Initial rollback procedures document
- **v1.1** (TBD): Updates based on actual rollback experience
