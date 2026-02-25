#!/bin/bash

# This script is used as the 'Ignored Build Step' in Vercel.
# It uses turbo-ignore to intelligently determine if a build is necessary.

echo "Checking if build should proceed using turbo-ignore..."

# npx -y turbo-ignore automatically detects the workspace and its dependencies.
# It exits with 1 if a build is needed, and 0 if it should be skipped.
npx -y turbo-ignore
