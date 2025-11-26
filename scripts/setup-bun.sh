#!/bin/bash

# Bun Setup Script for Tilly
# This script automates the setup process for Bun.js development

set -e

echo "🐰 Setting up Tilly with Bun..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    print_warning "Bun is not installed"
    echo ""
    echo "Install Bun from https://bun.sh:"
    echo "  curl -fsSL https://bun.sh/install | bash"
    echo ""
    read -p "Would you like to install Bun now? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
        
        if command -v bun &> /dev/null; then
            print_success "Bun installed successfully"
        else
            print_error "Bun installation failed. Please install manually."
            exit 1
        fi
    else
        print_error "Bun is required. Please install it first."
        exit 1
    fi
fi

print_success "Bun is installed: $(bun --version)"
echo ""

# Install dependencies with Bun
print_info "Installing dependencies with Bun..."
if bun install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi
echo ""

# Create bunfig.toml if it doesn't exist
if [ ! -f "bunfig.toml" ]; then
    print_info "Creating bunfig.toml..."
    cat > bunfig.toml << 'EOF'
# Bun configuration for Tilly
# This file configures Bun.js as an alternative package manager and runtime

[install]
# Use pnpm-style node_modules structure for compatibility
peer = true
production = false

[run]
# Enable compatibility with Node.js modules
bun = true
EOF
    print_success "bunfig.toml created"
else
    print_success "bunfig.toml already exists"
fi
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    print_warning "No .env file found"
    echo ""
    
    if [ -f ".env.example" ]; then
        read -p "Copy .env.example to .env? (Y/n): " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            cp .env.example .env
            print_success ".env created from .env.example"
            print_warning "Please edit .env with your API keys"
        fi
    else
        print_warning "No .env.example file found"
    fi
else
    print_success ".env file exists"
fi
echo ""

# Verify setup
print_info "Verifying setup..."
echo ""

if bun run check > /dev/null 2>&1; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript check failed (this may be expected)"
fi

echo ""
print_success "Setup complete!"
echo ""
print_info "Available commands:"
echo "  bun run dev:bun       - Start development server"
echo "  bun run build:bun     - Build for production (Vercel)"
echo "  bun run build:node:bun - Build for Node.js"
echo "  bun run preview:bun   - Preview production build"
echo "  bun run test:run:bun  - Run tests"
echo ""
print_info "For more information, see BUILD_INSTRUCTIONS.md"
