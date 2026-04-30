# Portfolio — first-time setup (Windows / PowerShell)
#
# Run from the repo root:  .\scripts\setup.ps1
# Idempotent — safe to re-run.

$ErrorActionPreference = 'Stop'
$repo = Resolve-Path "$PSScriptRoot\.."
Set-Location $repo

Write-Host ""
Write-Host "Portfolio setup — repo: $repo" -ForegroundColor Cyan
Write-Host ""

# 1. Node check ---------------------------------------------------------
$nodeVer = & node --version 2>$null
if (-not $nodeVer) {
  Write-Error "Node.js not found on PATH. Install Node 18.18 or later from https://nodejs.org"
}
Write-Host "Node: $nodeVer" -ForegroundColor Green

# 2. Move claude-config -> .claude --------------------------------------
$src = Join-Path $repo 'claude-config'
$dst = Join-Path $repo '.claude'
if (Test-Path $src) {
  if (-not (Test-Path $dst)) {
    Write-Host "Moving claude-config -> .claude ..."
    Move-Item $src $dst
  } else {
    Write-Host ".claude already exists; skipping move." -ForegroundColor Yellow
  }
}

# 3. .env from .env.example --------------------------------------------
$envExample = Join-Path $repo 'apps\api\.env.example'
$envFile = Join-Path $repo 'apps\api\.env'
if ((Test-Path $envExample) -and (-not (Test-Path $envFile))) {
  Copy-Item $envExample $envFile
  Write-Host ""
  Write-Host "Created apps/api/.env from .env.example." -ForegroundColor Green
  Write-Host "EDIT IT NOW: open apps\api\.env and set MONGO_URI, JWT_SECRET_ADMIN, ADMIN_PASSWORD." -ForegroundColor Yellow
  Write-Host "Press Enter when done (or Ctrl+C to bail and edit later)..." -ForegroundColor Yellow
  Read-Host | Out-Null
} elseif (Test-Path $envFile) {
  Write-Host "apps/api/.env already exists; skipping." -ForegroundColor Yellow
}

# 4. npm install at root (workspaces) -----------------------------------
Write-Host ""
Write-Host "Running npm install (this installs all workspaces — may take a few minutes)..."
npm install

# 5. Seed database ------------------------------------------------------
Write-Host ""
$doSeed = Read-Host "Run database seed now? (y/n)"
if ($doSeed -match '^[Yy]') {
  npm run seed
} else {
  Write-Host "Skipped. Run 'npm run seed' later when MongoDB is reachable." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Cyan
Write-Host "  npm run dev          # starts API (4001), UI (4200), Admin (4300) together"
Write-Host "  npm run dev:api      # API only"
Write-Host "  open http://localhost:4001/api/docs  # Swagger"
Write-Host ""
