# Tilly Build Instructions

## Package Manager Support

Tilly supports both **pnpm** (default) and **Bun.js** (alternative) for development and building.

---

## Using pnpm (Default & Recommended)

### Setup

```bash
git clone https://github.com/ccssmnn/tilly.git
cd tilly
pnpm install
cp .env.example .env
# Configure your environment variables
```

### Development

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build          # Vercel deployment (default)
pnpm build:node     # Node.js standalone server
```

### Preview

```bash
pnpm preview        # Preview Vercel build
pnpm preview:node   # Preview Node.js build
```

### Testing

```bash
pnpm test           # Watch mode
pnpm test:run       # Single run
pnpm test:e2e       # Playwright E2E tests
pnpm test:e2e:ui    # Playwright UI mode
```

---

## Using Bun.js (Alternative)

### Prerequisites

Install Bun from https://bun.sh:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Setup

```bash
git clone https://github.com/ccssmnn/tilly.git
cd tilly
bun install
cp .env.example .env
# Configure your environment variables
```

### Development

```bash
bun run dev:bun
# Or directly:
bun --bun astro dev
```

### Build for Production

```bash
bun run build:bun          # Vercel deployment
bun run build:node:bun     # Node.js standalone server
```

### Preview

```bash
bun run preview:bun        # Preview Vercel build
bun run preview:node:bun   # Preview Node.js build
```

### Testing

```bash
bun run test:run:bun       # Run tests with Bun
```

---

## Environment Variables

Create a `.env` file with the following variables:

| Variable                       | Description                   | How to Get                                      |
| ------------------------------ | ----------------------------- | ----------------------------------------------- |
| `PUBLIC_JAZZ_SYNC_SERVER`      | Jazz database sync server     | [jazz.tools](https://jazz.tools)                |
| `NEXT_PUBLIC_JAZZ_API_KEY`     | Jazz Cloud API key            | [jazz.tools/cloud](https://jazz.tools/cloud)    |
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI assistant (Gemini)         | [Google AI Studio](https://aistudio.google.com) |
| `PUBLIC_VAPID_KEY`             | Push notifications (public)   | `npx web-push generate-vapid-keys`              |
| `VAPID_PRIVATE_KEY`            | Push notifications (private)  | `npx web-push generate-vapid-keys`              |
| `VAPID_SUBJECT`                | Push notifications subject    | `mailto:your@email.com`                         |
| `CRON_SECRET`                  | Scheduled jobs authentication | Any random string                               |

### Generating VAPID Keys

```bash
npx web-push generate-vapid-keys
```

This outputs:

```
Public Key: BN...
Private Key: ...
```

Add these to your `.env` file.

---

## Deployment

### Vercel (Default)

```bash
# Using pnpm
pnpm build

# Using Bun
bun run build:bun
```

### Self-hosted Node.js

```bash
# Using pnpm
pnpm build:node
pnpm preview:node

# Using Bun
bun run build:node:bun
bun run preview:node:bun
```

---

## Compatibility Notes

### Bun.js Advantages

- ✅ Faster installation (~3-5x faster than pnpm)
- ✅ Faster script execution
- ✅ Built-in test runner
- ✅ Better TypeScript support out of the box

### Bun.js Considerations

- ⚠️ Some native Node.js modules may have compatibility issues
- ⚠️ Test thoroughly before production deployment with Bun
- ⚠️ Not all Astro plugins may be fully compatible

### Recommended Usage

**For Production**: Use **pnpm** (officially tested configuration)

**For Development**: Use **Bun** for faster iteration if all dependencies are compatible

---

## Troubleshooting

### Bun Compatibility Issues

If you encounter issues with Bun, try running without the `--bun` flag:

```bash
bun astro dev  # Uses Node.js runtime with Bun's package manager
```

### Module Resolution Issues

```bash
bun install --force  # Force reinstall all packages
```

### Clear Cache

```bash
# pnpm
pnpm store prune

# Bun
bun pm cache rm
```

### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install  # or: bun install
```

---

## Quick Reference

### pnpm Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm test:run     # Run tests
pnpm check        # Type check
pnpm format       # Format code
pnpm lint         # Lint code
```

### Bun Commands

```bash
bun install           # Install dependencies
bun run dev:bun       # Start dev server
bun run build:bun     # Build for production
bun run test:run:bun  # Run tests
bun --bun astro check # Type check
```

---

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Jazz Documentation](https://jazz.tools/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Full deployment guide
