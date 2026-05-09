# cleanup-orphans.ps1
#
# After the rebuild, several legacy files from the previous (NgModule + CV-style)
# scaffolding still exist on disk. They are excluded from the TypeScript build
# (see apps/api/tsconfig.json and apps/admin/tsconfig.app.json), so they don't
# affect compilation — but they're dead weight.
#
# Run this from PowerShell, from the repo root:
#
#   cd "E:\Project\FullStack Portfolio\portfolio"
#   powershell -ExecutionPolicy Bypass -File .\scripts\cleanup-orphans.ps1
#
# It will list everything it intends to delete and prompt before removing.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

$paths = @(
  # ── API legacy ─────────────────────────────────────────────
  'apps\api\src\pages\themes',
  'apps\api\src\pages\languages',
  'apps\api\src\pages\awards',
  'apps\api\src\pages\references',
  'apps\api\src\pages\cv',
  'apps\api\src\schema\theme.schema.ts',
  'apps\api\src\schema\language.schema.ts',
  'apps\api\src\schema\award.schema.ts',
  'apps\api\src\schema\cv-reference.schema.ts',
  'apps\api\src\schema\cv-personal.schema.ts',
  'apps\api\src\schema\cv-summary.schema.ts',
  'apps\api\src\schema\skill.schema.ts',
  'apps\api\src\dto\theme.dto.ts',
  'apps\api\src\dto\language.dto.ts',
  'apps\api\src\dto\award.dto.ts',
  'apps\api\src\dto\cv-reference.dto.ts',
  'apps\api\src\dto\cv-personal.dto.ts',
  'apps\api\src\dto\cv-summary.dto.ts',
  'apps\api\src\dto\cv-import.dto.ts',
  'apps\api\src\dto\skill.dto.ts',

  # ── Admin (old NgModule scaffolding) ──────────────────────
  'apps\admin\src\app\app.module.ts',
  'apps\admin\src\app\app-routing.module.ts',
  'apps\admin\src\app\material',
  'apps\admin\src\app\admin-auth',
  'apps\admin\src\app\auth-guard',
  'apps\admin\src\app\auth-interceptor',
  'apps\admin\src\app\services\admin',
  'apps\admin\src\app\services\common',
  'apps\admin\src\app\pages\dashboard\dashboard.component.html',
  'apps\admin\src\app\pages\dashboard\dashboard.component.scss',
  'apps\admin\src\app\pages\dashboard\dashboard.module.ts',
  'apps\admin\src\app\pages\projects\projects.module.ts',
  'apps\admin\src\app\pages\projects\add-project',
  'apps\admin\src\app\pages\projects\all-projects',
  'apps\admin\src\app\shared',

  # ── Old apps/ui (replaced by apps/ui-default) ─────────────
  'apps\ui'
)

$existing = @()
foreach ($p in $paths) {
  $full = Join-Path $root $p
  if (Test-Path $full) { $existing += $full }
}

if ($existing.Count -eq 0) {
  Write-Host 'Nothing to clean — workspace is already tidy.' -ForegroundColor Green
  exit 0
}

Write-Host ''
Write-Host 'The following legacy paths will be removed:' -ForegroundColor Yellow
foreach ($p in $existing) { Write-Host "  $p" }
Write-Host ''

$confirm = Read-Host 'Type DELETE to proceed'
if ($confirm -ne 'DELETE') {
  Write-Host 'Aborted.' -ForegroundColor Yellow
  exit 1
}

foreach ($p in $existing) {
  Remove-Item -Recurse -Force -Path $p
  Write-Host "Removed $p" -ForegroundColor Green
}

Write-Host ''
Write-Host 'Cleanup complete. You can now also drop the matching `exclude` entries'
Write-Host 'in apps\api\tsconfig.json and apps\admin\tsconfig.app.json if you like.'
