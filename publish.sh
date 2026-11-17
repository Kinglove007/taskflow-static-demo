#!/usr/bin/env bash
set -euo pipefail
REMOTE_URL="${1:-}"
if [[ -z "$REMOTE_URL" ]]; then
  echo "Usage: bash publish.sh https://github.com/YOUR_USERNAME/deployme-daymark.git" >&2
  exit 2
fi
cd "$(dirname "$0")"
node --check script.js
[ -s index.html ] && [ -s styles.css ] && [ -s script.js ]

if [[ ! -d .git ]]; then git init; fi
git add .
if ! git diff --cached --quiet; then git commit -m "Add deployme-daymark DeployMe demo"; fi
git branch -M main
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi
git push -u origin main
printf '\nPublished deployme-daymark to %s\n' "$REMOTE_URL"
