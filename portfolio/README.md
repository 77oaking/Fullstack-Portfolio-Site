# Portfolio Platform

Themeable full-stack portfolio: Angular 17 public site, Angular 17 admin, NestJS 10 API, MongoDB. Themes are JSON files swapped at runtime via CSS custom properties.

## Quickstart

```powershell
# 1. Install everything (root + all workspaces)
cd "E:\Project\FullStack Portfolio\portfolio"
npm install

# 2. Configure the API
cp apps/api/.env.example apps/api/.env
# Open apps/api/.env and set MONGO_URI, JWT_SECRET_ADMIN, ADMIN_USERNAME, ADMIN_PASSWORD

# 3. Seed the database (creates the admin user, two built-in themes, settings doc)
npm run seed

# 4. Run all three apps
npm run dev
```

After `npm run dev` you should see:

| App   | URL                       |
|-------|---------------------------|
| UI    | http://localhost:4200     |
| Admin | http://localhost:4300     |
| API   | http://localhost:4001     |
| Docs  | http://localhost:4001/api/docs (Swagger) |

Log in to admin with the credentials you set in `.env`.

## Repo layout

```
apps/
  api/    NestJS 10 + Mongoose
  ui/     Angular 17 public site
  admin/  Angular 17 admin
libs/
  shared-types/   TS interfaces
  theme-engine/   Theme apply/load/remember
  themes/         Theme JSON files
docs/             ARCHITECTURE.md, THEME_SCHEMA.md, API_CONTRACT.md
.claude/          Slash commands and MCP config for Claude Code
```

See `docs/` for the full architecture, theme schema, and API contract.
See `CLAUDE.md` for working conventions.

## Common tasks

```bash
npm run dev:api          # API only (with watch)
npm run dev:ui           # UI only
npm run dev:admin        # Admin only
npm run seed             # (Re)seed admin + themes + settings
npm run lint             # Lint everything
npm run format           # Prettier across the repo
npm run validate-themes  # Validate every JSON in libs/themes/
npm run build            # Build all three apps for production
```

## Add a new theme

1. Drop `libs/themes/<my-theme>.json` (copy `minimal-light.json` as a starting point).
2. `npm run validate-themes` — must pass.
3. Optionally add it to the seed script so a fresh DB has it.
4. Restart the API — admin can now activate it from the Themes page.

## Add a new API resource

Use the slash command in Claude Code: `/new-resource <name>`. Or by hand: copy `apps/api/src/pages/projects/`, rename, replace the schema/DTO, register the module in `app.module.ts`.
