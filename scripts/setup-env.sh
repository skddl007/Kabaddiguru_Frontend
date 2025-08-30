#!/bin/bash

# Environment setup script for Kabaddi Guru Frontend

echo "Setting up environment variables..."

# Check if .env.local exists, if not create it
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    touch .env.local
fi

# Function to set production environment
set_production_env() {
    echo "Setting production environment..."
    cat > .env.local << EOF
# Production Environment Configuration
NEXT_PUBLIC_API_URL=https://api.thekabaddiguru.com
NEXT_PUBLIC_APP_NAME=Kabaddi Guru Analytics
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG_MODE=false
NODE_ENV=production
EOF
    echo "Production environment set!"
}

# Function to set development environment
set_dev_env() {
    echo "Setting development environment..."
    cat > .env.local << EOF
# Development Environment Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Kabaddi Guru Analytics
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG_MODE=true
NODE_ENV=development
EOF
    echo "Development environment set!"
}

# Function to show current environment
show_current_env() {
    if [ -f .env.local ]; then
        echo "Current environment configuration:"
        cat .env.local
    else
        echo "No .env.local file found"
    fi
}

# Parse command line arguments
case "$1" in
    "prod"|"production")
        set_production_env
        ;;
    "dev"|"development")
        set_dev_env
        ;;
    "show"|"current")
        show_current_env
        ;;
    *)
        echo "Usage: $0 {prod|dev|show}"
        echo "  prod     - Set production environment"
        echo "  dev      - Set development environment"
        echo "  show     - Show current environment"
        exit 1
        ;;
esac
