#!/bin/bash

# Staging Deployment Script for Tilly
# This script automates the staging deployment process

set -e  # Exit on error

echo "🚀 Starting Staging Deployment Process..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "clerk-to-passkey" ]; then
    print_error "Not on clerk-to-passkey branch. Current branch: $CURRENT_BRANCH"
    echo "Switch to clerk-to-passkey branch first:"
    echo "  git checkout clerk-to-passkey"
    exit 1
fi
print_success "On correct branch: $CURRENT_BRANCH"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi
print_success "No uncommitted changes"

# Pull latest changes
print_info "Pulling latest changes..."
git pull origin clerk-to-passkey
print_success "Branch is up to date"

# Run tests
print_info "Running tests..."
if pnpm test:run; then
    print_success "All tests passed"
else
    print_error "Tests failed. Fix issues before deploying."
    exit 1
fi

# Run type checking
print_info "Running TypeScript checks..."
if pnpm check; then
    print_success "No TypeScript errors"
else
    print_error "TypeScript errors found. Fix issues before deploying."
    exit 1
fi

# Build the application
print_info "Building application..."
if pnpm build; then
    print_success "Build successful"
else
    print_error "Build failed. Fix issues before deploying."
    exit 1
fi

echo ""
print_success "Pre-deployment checks completed successfully!"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Install it with:"
    echo "  npm i -g vercel"
    echo ""
    print_info "Or deploy manually using the Vercel dashboard"
    exit 0
fi

# Ask user if they want to deploy
echo "Ready to deploy to staging?"
echo "This will create a preview deployment on Vercel."
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

# Deploy to Vercel
print_info "Deploying to Vercel staging..."
if vercel --env staging; then
    print_success "Deployment successful!"
    echo ""
    print_info "Next steps:"
    echo "1. Open the staging URL provided by Vercel"
    echo "2. Follow the checklist in docs/STAGING_DEPLOYMENT_CHECKLIST.md"
    echo "3. Test all authentication flows"
    echo "4. Verify no console errors"
    echo "5. Sign off on staging deployment"
else
    print_error "Deployment failed"
    exit 1
fi

echo ""
print_success "Staging deployment process completed!"
