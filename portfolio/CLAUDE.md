# CLAUDE.md — Portfolio Platform

This file is read by Claude (claude.ai, Claude Code, Cowork) at the start of every session in this repo. Keep it short, current, and honest.

## What this is

A themeable personal portfolio platform. Three apps in one monorepo:

- `apps/ui` — public Angular 17 site (NgModules, lazy-loaded feature modules).
- `apps/admin` — auth-gated Angular 17 admin (manages content + themes).
- `apps/api` — NestJS 10 backend, MongoDB via Mongoose.

Plus three internal libraries in `libs/`:

- `shared-types` — TS interfaces shared by all three apps.
- `theme-engine` — pure-TS, applies a theme JSON as CSS custom properties on `:root`.
- `themes` — JSON files, one per theme.

## Conventions (non-obvious)

- **Angular: NgModules, not standalone.** Lazy-load every feature module via `loadChildren`.
- **NestJS: feature modules under `src/pages/<feature>/`.** Schemas flat under `src/schema/`. DTOs flat under `src/dto/`. Mirrors the existing `rone-api` style.
- **Mongoose schemas use raw `new mongoose.Schema()`**, not `@Schema()` decorators. `timestamps: true`, `versionKey: false`.
- **Auth: admin only.** Admin token is sent in a custom header named `administrator` (not `Authorization`). Single-admin model — no role/permission system.
- **Response envelope on every API response:** `{ success, data?, count?, message?, errorCode? }`. Errors go through `AllExceptionsFilter` so the shape is consistent.
- **Validation:** `class-validator` on every DTO. `MongoIdValidationPipe` on every `:id` route param.
- **Themes are runtime-switchable.** SCSS in apps references `var(--color-bg)`, `var(--space-4)`, etc. — never hard-coded values.
- **TypeScript strict mode is on everywhere.** Don't disable.
- **File naming: kebab-case.** Class naming: PascalCase + role suffix (`ProjectsService`, `ProjectListComponent`).

## Commands

| Action               | Command                              |
|----------------------|--------------------------------------|
| Install              | `npm install` (run at repo root)     |
| Run all three apps   | `npm run dev`                        |
| Run API only         | `npm run dev:api`                    |
| Run UI only          | `npm run dev:ui`                     |
| Run admin only       | `npm run dev:admin`                  |
| Seed DB              | `npm run seed`                       |
| Lint everything      | `npm run lint`                       |
| Format everything    | `npm run format`                     |
| Build all            | `npm run build`                      |

## Where things live

```
portfolio/
  apps/
    api/   src/{config,filters,guards,pipes,decorator,schema,dto,pages}/...
    ui/    src/app/{core,shared,material,services,pages,enum,interfaces}/...
    admin/ src/app/{admin-auth,auth-guard,auth-interceptor,services,pages,shared,...}/...
  libs/
    shared-types/src/  -> Project, Skill, Experience, Theme, Settings, ResponsePayload, ...
    theme-engine/src/  -> applyTheme, loadStoredTheme, rememberTheme, flattenToCssVars
    themes/            -> minimal-light.json, editorial-serif.json, ...
  docs/
    ARCHITECTURE.md THEME_SCHEMA.md API_CONTRACT.md
  scripts/
    setup.ps1 setup.sh validate-themes.mjs
```

## Adding things — quick reference

- **New API resource:** copy `apps/api/src/pages/projects/` and rename. Mirror the schema, DTO, module, controller, service. Register in `app.module.ts`. Use `@UseGuards(AdminJwtAuthGuard)` on mutating routes.
- **New UI page:** create `apps/ui/src/app/pages/<feature>/`. Module + routing module + component. Lazy-register in `app-routing.module.ts`. Inject `<Feature>Service` from `services/common/`.
- **New admin page:** mirror an existing one under `apps/admin/src/app/pages/<feature>/`. Add to the sidebar in `pages.component.html`.
- **New theme:** drop a `<id>.json` in `libs/themes/`. Run `npm run validate-themes`. Add to seed if you want it preloaded.

## Slash commands available

- `/new-resource <name>` — scaffold a full API resource.
- `/new-theme <name>` — start a new theme JSON from a template.
- `/review` — lint + tests + diff review.

## Don'ts

- Don't use Angular standalone components — convention is NgModules.
- Don't use `@Schema()` decorators — convention is raw `new mongoose.Schema()`.
- Don't add `Authorization: Bearer` for admin — use the `administrator` custom header.
- Don't hard-code colors/spacing in SCSS — always `var(--token)`.
- Don't skip the `MongoIdValidationPipe` on `:id` params.
- Don't return raw exceptions from controllers — let `AllExceptionsFilter` shape them.
