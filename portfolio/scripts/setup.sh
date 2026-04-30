#!/usr/bin/env bash
# Portfolio — first-time setup (Git Bash / WSL / Linux / macOS)
#
# Run from the repo root:  ./scripts/setup.sh
# Idempotent — safe to re-run.

set -e
cd "$(dirname "$0")/.."
REPO="$(pwd)"

echo
echo "Portfolio setup — repo: $REPO"
echo

# 1. Node check
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js not found on PATH. Install Node 18.18 or later." >&2
  exit 1
fi
echo "Node: $(node --version)"

# 2. Move claude-config -> .claude
if [ -d "claude-config" ] && [ ! -d ".claude" ]; then
  echo "Moving claude-config -> .claude ..."
  mv claude-config .claude
elif [ -d ".claude" ]; then
  echo ".claude already exists; skipping move."
fi

# 3. .env from .env.example
if [ -f "apps/api/.env.example" ] && [ ! -f "apps/api/.env" ]; then
  cp apps/api/.env.example apps/api/.env
  echo
  echo "Created apps/api/.env from .env.example."
  echo "EDIT IT NOW: set MONGO_URI, JWT_SECRET_ADMIN, ADMIN_PASSWORD."
  read -p "Press Enter when done... " _
elif [ -f "apps/api/.env" ]; then
  echo "apps/api/.env already exists; skipping."
fi

# 4. npm install at root (workspaces)
echo
echo "Running npm install ..."
npm install

# 5. Seed
echo
read -p "Run database seed now? (y/n) " seed
if [ "$seed" = "y" ] || [ "$seed" = "Y" ]; then
  npm run seed
else
  echo "Skipped. Run 'npm run seed' later when MongoDB is reachable."
fi

echo
echo "Done. Next steps:"
echo "  npm run dev          # starts API (4001), UI (4200), Admin (4300)"
echo "  open http://localhost:4001/api/docs"
echo
