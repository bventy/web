#!/bin/bash

# scripts/setup-local-env.sh
# Detects running Bventy app ports and generates .env.local files correctly.

echo "Detecting Bventy applications running on localhost..."

declare -A PORTS
declare -A APPS=( ["auth"]="Welcome back" ["admin"]="Admin Dashboard" ["vendor"]="Vendor Dashboard" ["www"]="flex-1" ["app"]="animate-spin" )

for port in {3000..3010}; do
    response=$(curl -s http://localhost:$port)
    if [ -n "$response" ]; then
        for app in "${!APPS[@]}"; do
            if [[ "$response" == *"${APPS[$app]}"* ]]; then
                echo "Found $app on port $port"
                PORTS[$app]="http://localhost:$port"
                break
            fi
        done
    fi
done

# Define URLs
WWW_URL=${PORTS[www]:-http://localhost:3004}
AUTH_URL=${PORTS[auth]:-http://localhost:3002}
APP_URL=${PORTS[app]:-http://localhost:3001}
ADMIN_URL=${PORTS[admin]:-http://localhost:3000}
VENDOR_URL=${PORTS[vendor]:-http://localhost:3003}

echo "Generating .env.local files..."

CONTENT="NEXT_PUBLIC_WWW_URL=$WWW_URL
NEXT_PUBLIC_AUTH_URL=$AUTH_URL
NEXT_PUBLIC_APP_URL=$APP_URL
NEXT_PUBLIC_ADMIN_URL=$ADMIN_URL
NEXT_PUBLIC_VENDOR_URL=$VENDOR_URL
NEXT_PUBLIC_API_URL=https://bventy-api.onrender.com"

for app_dir in apps/*; do
    if [ -d "$app_dir" ]; then
        echo "Updating $app_dir/.env.local"
        echo "$CONTENT" > "$app_dir/.env.local"
    fi
done

echo "Done! Please restart your dev server for changes to take effect."
