#!/bin/bash

# This script is used as the 'Ignored Build Step' in Vercel.
# It prevents unnecessary builds when changes don't affect the specific app.

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Error: APP_NAME not provided"
  exit 1
fi

echo "Checking if build should proceed for $APP_NAME..."

# Check if there are changes in the specific app or in shared packages
if git diff HEAD^ HEAD --quiet apps/$APP_NAME packages/ui packages/services package.json turbo.json; then
  echo "✅ No changes detected in apps/$APP_NAME or shared packages. Skipping build."
  exit 0
else
  echo "🛑 Changes detected. Proceeding with build."
  exit 1
fi
