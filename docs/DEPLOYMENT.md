# Deployment Guide

This guide covers deploying Tilly with Jazz Passkey authentication.

## Prerequisites

Before deploying, you'll need:

1. **Jazz Cloud API Key** - Get from [jazz.tools/cloud](https://jazz.tools/cloud)
2. **Google Gemini API Key** - For AI assistant features
3. **VAPID Keys** - For push notifications
4. **Vercel Account** - For hosting (or your preferred platform)

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Jazz Configuration
PUBLIC_JAZZ_SYNC_SERVER=wss://cloud.jazz.tools/?key=YOUR_API_KEY
NEXT_PUBLIC_JAZZ_API_KEY=YOUR_API_KEY

# AI Assistant
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your@email.com

# Cron Jobs
CRON_SECRET=random_secret_string

# Optional: Custom Jazz Sync Server
# PUBLIC_JAZZ_SYNC_SERVER=wss://your-sync-server.com
```

### Generating VAPID Keys

```bash
npx web-push generate-vapid-keys
```

This will output:
```
Public Key: BN...
Private Key: ...
```

Add these to your `.env` file.

## Deployment Platforms

### Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Set Environment Variables**:
```bash
vercel env add PUBLIC_JAZZ_SYNC_SERVER
vercel env add NEXT_PUBLIC_JAZZ_API_KEY
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
vercel env add VAPID_PUBLIC_KEY
vercel env add VAPID_PRIVATE_KEY
vercel env add VAPID_SUBJECT
vercel env add CRON_SECRET
```

4. **Deploy to Production**:
```bash
vercel --prod
```

### Docker

1. **Build Image**:
```bash
docker build -t tilly .
```

2. **Run Container**:
```bash
docker run -p 3000:3000 \
  -e PUBLIC_JAZZ_SYNC_SERVER=wss://cloud.jazz.tools/?key=YOUR_KEY \
  -e NEXT_PUBLIC_JAZZ_API_KEY=YOUR_KEY \
  -e GOOGLE_GENERATIVE_AI_API_KEY=your_key \
  -e VAPID_PUBLIC_KEY=your_key \
  -e VAPID_PRIVATE_KEY=your_key \
  -e VAPID_SUBJECT=mailto:your@email.com \
  -e CRON_SECRET=your_secret \
  tilly
```

### Other Platforms

Tilly can be deployed to any platform that supports Node.js applications:

- **Netlify**: Use the Netlify CLI or connect your GitHub repo
- **Railway**: Connect your GitHub repo and set environment variables
- **Fly.io**: Use `fly launch` and configure environment variables
- **Self-hosted**: Build with `pnpm build` and serve with any Node.js server

## Post-Deployment Configuration

### 1. Configure Cron Jobs

⚠️ **Note**: Push notification cron jobs are currently disabled due to Jazz's architecture. See [CRON_JOBS_LIMITATION.md](CRON_JOBS_LIMITATION.md) for details and future plans.

If you want to enable cron jobs in the future:

1. Set up a cron endpoint in your deployment platform
2. Configure it to call `/api/cron/push-notifications` with the `CRON_SECRET` header
3. Schedule it to run at your desired interval (e.g., every hour)

### 2. Test Authentication

1. Visit your deployed URL
2. Click "Sign Up" and create a test account
3. Verify passkey creation works on your device
4. Test data sync by creating a person and note
5. Log out and log back in to verify persistence

### 3. Test Push Notifications

1. Enable notifications in Settings
2. Create a reminder with a due date
3. Wait for the notification to arrive (or trigger manually via API)

### 4. Monitor Logs

Check your deployment platform's logs for:
- Authentication errors
- Sync connection issues
- API errors
- Push notification delivery

## Security Considerations

### HTTPS Required

Passkeys require a secure context (HTTPS). Ensure your deployment:
- Uses HTTPS in production
- Has a valid SSL certificate
- Redirects HTTP to HTTPS

### Environment Variables

- Never commit `.env` files to version control
- Use your platform's secret management for sensitive values
- Rotate secrets regularly (especially CRON_SECRET)

### CORS Configuration

If deploying API and frontend separately:
- Configure CORS headers appropriately
- Whitelist only your frontend domain
- Use secure cookie settings

## Scaling Considerations

### Jazz Cloud Limits

Free tier includes:
- 100 MB storage
- 10 GB bandwidth/month
- Unlimited sync connections

For higher limits, upgrade your Jazz Cloud plan.

### Database Performance

Jazz is designed for offline-first, client-side operation:
- Most operations happen locally
- Sync is incremental and efficient
- No database scaling needed on your end

### API Rate Limiting

Consider implementing rate limiting for:
- AI assistant endpoints (to control Gemini API costs)
- Push notification endpoints
- Data export/import endpoints

## Monitoring

### Key Metrics to Monitor

1. **Authentication Success Rate**
   - Track passkey creation failures
   - Monitor login success/failure rates

2. **Sync Performance**
   - WebSocket connection stability
   - Sync latency and errors

3. **API Performance**
   - AI assistant response times
   - Push notification delivery rates

4. **Error Rates**
   - Client-side errors (via error boundary)
   - Server-side errors (via logs)

### Recommended Tools

- **Vercel Analytics** - Built-in for Vercel deployments
- **Sentry** - Error tracking and monitoring
- **LogRocket** - Session replay and debugging
- **Uptime Robot** - Uptime monitoring

## Backup and Recovery

### Data Backup

Jazz handles data persistence, but you should:
1. Regularly export your data via Settings → Download Data
2. Store backups securely
3. Test restore process periodically

### Disaster Recovery

If your deployment fails:
1. Redeploy from your Git repository
2. Restore environment variables
3. Users' data is safe in Jazz Cloud
4. No database migration needed

## Troubleshooting

### Passkey Creation Fails

- Verify HTTPS is enabled
- Check browser console for WebAuthn errors
- Ensure device supports biometric authentication
- Test with different browsers/devices

### Sync Not Working

- Verify Jazz API key is correct
- Check WebSocket connection in browser DevTools
- Ensure firewall allows WebSocket connections
- Check Jazz Cloud status page

### Push Notifications Not Delivered

- Verify VAPID keys are correct
- Check notification permissions in browser
- Ensure service worker is registered
- Review push notification logs

### Build Failures

- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Check Node.js version (requires v20+)
- Verify all environment variables are set
- Review build logs for specific errors

## Rollback Procedure

If you need to rollback to a previous version:

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Docker

```bash
# Pull previous image version
docker pull tilly:previous-tag

# Stop current container
docker stop tilly

# Start previous version
docker run -d --name tilly tilly:previous-tag
```

### Git-based Deployments

```bash
# Revert to previous commit
git revert HEAD

# Or checkout specific commit
git checkout <commit-hash>

# Push to trigger redeployment
git push origin main
```

## Support

For deployment issues:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md)
- File an issue on GitHub
- Email: assmann@hey.com

## Additional Resources

- [Jazz Documentation](https://jazz.tools/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [WebAuthn Guide](https://webauthn.guide)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
