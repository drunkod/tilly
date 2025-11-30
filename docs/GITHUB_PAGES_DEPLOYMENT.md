# Deploying Tilly to GitHub Pages

This guide walks you through deploying your Tilly app to GitHub Pages as a static site.

## Overview

GitHub Pages allows you to host static websites directly from your GitHub repository. Tilly can be deployed as a static Progressive Web App (PWA) that works offline-first, with data syncing through Jazz Cloud.

## Prerequisites

Before deploying to GitHub Pages, ensure you have:

1. **GitHub Account** - Your repository must be hosted on GitHub
2. **Jazz Cloud API Key** - Get from [jazz.tools/cloud](https://jazz.tools/cloud) for data sync
3. **(Optional) Backend Server** - For AI assistant features, you can deploy a separate backend

## Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/pages-source-github-actions.webp)

## Step 2: Configure Repository Variables

You need to set up repository variables for the build process:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on the **Variables** tab
3. Add the following repository variables:

### Required Variables

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `PUBLIC_JAZZ_SYNC_SERVER` | Jazz Cloud WebSocket URL | `wss://cloud.jazz.tools/?key=YOUR_API_KEY` |

### Optional Variables

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `PUBLIC_SERVER_URL` | Backend server URL for AI features | `https://your-backend.vercel.app` |
| `GITHUB_PAGES_BASE` | Custom domain or repo path | `username.github.io/tilly` |

### Setting Variables

Click **New repository variable** for each variable:

1. **Name**: Enter the variable name (e.g., `PUBLIC_JAZZ_SYNC_SERVER`)
2. **Value**: Enter the variable value
3. Click **Add variable**

> [!IMPORTANT]
> The `PUBLIC_JAZZ_SYNC_SERVER` variable is **required** for data sync to work. Without it, your app won't be able to save or sync data.

## Step 3: Configure Base Path (If Using Project Pages)

If you're deploying to a project page (e.g., `username.github.io/tilly` instead of `username.github.io`), you need to set the `GITHUB_PAGES_BASE` variable.

### For User/Organization Pages
- URL: `https://username.github.io`
- `GITHUB_PAGES_BASE`: Leave empty or set to `username.github.io`

### For Project Pages
- URL: `https://username.github.io/tilly`
- `GITHUB_PAGES_BASE`: `username.github.io/tilly`

The workflow automatically extracts the site and base path from this variable.

## Step 4: Deploy

The deployment happens automatically via GitHub Actions:

### Automatic Deployment

Every push to the `main` branch triggers a deployment:

```bash
git add .
git commit -m "Update app"
git push origin main
```

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

## Step 5: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Monitor the **build** and **deploy** jobs
4. Once complete, your site will be live!

The deployment URL will be shown in the deploy job output.

## Step 6: Access Your App

Once deployed, your app will be available at:

- **User/Org pages**: `https://username.github.io`
- **Project pages**: `https://username.github.io/repository-name`

> [!TIP]
> Add this URL to your repository description and README for easy access!

## Understanding the Deployment

### What Gets Deployed

The GitHub Actions workflow:

1. **Checks out** your code
2. **Installs** dependencies with pnpm
3. **Builds** a static version using `pnpm build:static`
4. **Uploads** the `dist` folder as a Pages artifact
5. **Deploys** to GitHub Pages

### Static Build Differences

The static build (`ASTRO_OUTPUT=static`) differs from the server build:

- ✅ **Works**: PWA features, offline mode, data sync, authentication
- ✅ **Works**: All client-side features and UI
- ❌ **Doesn't work**: Server-side AI assistant (requires separate backend)
- ❌ **Doesn't work**: Push notifications (requires server endpoints)

### Service Worker & PWA

The static build includes a service worker that enables:

- **Offline functionality** - App works without internet
- **Install to home screen** - Users can install as a native app
- **Background sync** - Data syncs when connection is restored
- **Asset caching** - Fast loading on repeat visits

## Optional: Add AI Assistant Backend

To enable the AI assistant features in your static deployment, you need a separate backend server.

### Option 1: Deploy Backend to Vercel

1. Create a new Vercel project for the backend
2. Set environment variables:
   ```bash
   GOOGLE_AI_API_KEY=your_gemini_api_key
   VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   CRON_SECRET=random_secret_string
   ```
3. Deploy with `vercel --prod`
4. Add the Vercel URL as `PUBLIC_SERVER_URL` in GitHub variables

### Option 2: Use Existing Deployment

If you already have Tilly deployed elsewhere (Vercel, Railway, etc.):

1. Use that deployment URL as your backend
2. Set `PUBLIC_SERVER_URL` to point to it
3. The static site will make API calls to that server

## Custom Domain

To use a custom domain with GitHub Pages:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `tilly.yourdomain.com`)
3. Add a `CNAME` record in your DNS settings:
   - **Type**: CNAME
   - **Name**: `tilly` (or `@` for root domain)
   - **Value**: `username.github.io`
4. Wait for DNS propagation (can take up to 24 hours)
5. Enable **Enforce HTTPS** in GitHub Pages settings

> [!WARNING]
> Passkey authentication requires HTTPS. GitHub Pages automatically provides HTTPS, but ensure it's enabled before testing authentication.

## Troubleshooting

### Build Fails

**Error**: `Dependencies installation failed`
- **Solution**: Ensure `pnpm-lock.yaml` is committed to your repository

**Error**: `Build command failed`
- **Solution**: Check that all required variables are set in repository settings
- **Solution**: Review the build logs in the Actions tab for specific errors

### App Loads But Data Doesn't Sync

**Problem**: App works but data isn't saving
- **Solution**: Verify `PUBLIC_JAZZ_SYNC_SERVER` is set correctly
- **Solution**: Check browser console for WebSocket connection errors
- **Solution**: Ensure your Jazz Cloud API key is valid

### Authentication Not Working

**Problem**: Can't create passkeys or sign in
- **Solution**: Ensure HTTPS is enabled (GitHub Pages does this automatically)
- **Solution**: Test on a device that supports WebAuthn (most modern browsers)
- **Solution**: Check browser console for WebAuthn errors

### 404 Errors on Page Refresh

**Problem**: Direct navigation to routes shows 404
- **Solution**: This is expected with client-side routing on GitHub Pages
- **Solution**: The app uses hash-based routing in static mode to avoid this issue
- **Solution**: If using custom domain, you may need to add a 404.html redirect

### Assets Not Loading

**Problem**: CSS, JS, or images return 404
- **Solution**: Verify `GITHUB_PAGES_BASE` is set correctly for project pages
- **Solution**: Check that the base path matches your repository name
- **Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

## Workflow File Reference

The deployment workflow is located at `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build static site
        run: pnpm build:static
        env:
          PUBLIC_JAZZ_SYNC_SERVER: ${{ vars.PUBLIC_JAZZ_SYNC_SERVER }}
          PUBLIC_SERVER_URL: ${{ vars.PUBLIC_SERVER_URL }}
          GITHUB_PAGES_BASE: ${{ vars.GITHUB_PAGES_BASE }}

      - name: Upload pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Local Testing of Static Build

Before deploying, you can test the static build locally:

```bash
# Build static version
pnpm build:static

# Preview the static build
pnpm preview:static
```

This serves the `dist` folder locally so you can verify everything works.

## Updating Your Deployment

To update your deployed app:

1. Make changes to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. GitHub Actions automatically rebuilds and redeploys
4. Wait 2-5 minutes for deployment to complete

## Security Considerations

### Environment Variables

- ✅ **Safe to expose**: `PUBLIC_JAZZ_SYNC_SERVER`, `PUBLIC_SERVER_URL`, `GITHUB_PAGES_BASE`
- ❌ **Never expose**: API keys, secrets, private keys

Use **Variables** (not Secrets) for public values that need to be embedded in the static build.

### HTTPS

- GitHub Pages automatically provides HTTPS
- Passkey authentication requires HTTPS
- Never disable HTTPS enforcement

### Data Privacy

- All data is encrypted client-side before syncing to Jazz
- GitHub Pages only serves static files
- No sensitive data is stored in the static build

## Cost

GitHub Pages is **free** for public repositories with:

- 1 GB storage
- 100 GB bandwidth/month
- Unlimited builds

For private repositories, GitHub Pages is free with GitHub Pro, Team, or Enterprise.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jazz Documentation](https://jazz.tools/docs)
- [Astro Static Site Generation](https://docs.astro.build/en/guides/static-site-generation/)

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the workflow logs in the Actions tab
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for general deployment guidance
4. File an issue on GitHub
5. Email: assmann@hey.com

---

**Happy deploying! 🚀**
