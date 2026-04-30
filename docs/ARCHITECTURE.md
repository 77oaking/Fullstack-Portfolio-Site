# Portfolio Architecture

This document captures the conventions extracted from your existing repos (`rone-ui`, `rone-api`, `rone-admin`) and proposes the layout for the new portfolio platform. Where the new project deviates, the reasoning is explicit.

## 1. Conventions extracted from your existing code

Your three repos share a coherent style. The new portfolio will adopt it as the default and only deviate where the portfolio's needs (multi-theme, simpler content model, modern tooling) require it.

**Angular (rone-ui, rone-admin).** Traditional `NgModule` architecture, never standalone. Feature modules live under `src/app/pages/<feature>/` and are lazy-loaded via `loadChildren`. State management is RxJS-only — services with observables, no NgRx, no signals — which is appropriate for a portfolio. Styling is SCSS with Material + a centralized `MaterialModule` that re-exports the Material components used across the app. File names are kebab-case (`product-list.component.ts`), class names PascalCase with role suffix (`ProductListComponent`, `ProductService`), selectors use the `app-` prefix. Auth is handled via a single HTTP interceptor that injects a token under the custom header `administrator` (admin) or `Authorization: Bearer` (user); two complementary guards (`AuthGuard`, `AuthStateGuard`) protect routes and the inverse routes (login). Environment URLs come from `src/environments/environment{,.prod}.ts`. Tsconfig is intentionally permissive (`strict: false`) — for the new portfolio we'll flip this to `strict: true` because it pays back almost immediately on a small codebase.

**NestJS (rone-api).** Feature modules under `src/pages/<feature>/` with controller/service/module triples. Mongoose schemas defined with raw `new mongoose.Schema()` (not `@Schema()` decorators) and stored flat under `src/schema/`, with `MongooseModule.forFeature([{ name, schema }])` wired in each feature module. DTOs live flat under `src/dto/` and use `class-validator` decorators (`@IsString`, `@IsOptional`, `@ValidateNested`, etc.). The bootstrap pattern enables CORS, URI versioning, and a `/api` global prefix. Auth uses Passport + JWT with two strategies (`adminToken`, `userToken`), each with its own custom HTTP header, plus role-based and permission-based guards driven by metadata decorators (`@AdminMetaRoles`, `@AdminMetaPermissions`). Every endpoint returns the same envelope:

```ts
interface ResponsePayload {
  success: boolean;
  data?: any;
  count?: number;
  message?: string;
}
```

Config is `@nestjs/config` with a factory in `src/config/configuration.ts`. There is no Swagger, no global exception filter, and no env validation schema today — we'll add all three for the portfolio.

## 2. Recommended layout for the new portfolio

A single Git repo organized as an npm workspaces monorepo. This keeps `shared-types` and `theme-engine` in sync across the three apps with zero ceremony.

```
portfolio/
  apps/
    api/                  # NestJS (mirrors rone-api conventions)
    ui/                   # Angular public site (mirrors rone-ui)
    admin/                # Angular admin (mirrors rone-admin)
  libs/
    shared-types/         # TS interfaces for API responses, content, themes
    theme-engine/         # Pure-TS: applies a theme JSON to CSS variables
    themes/               # JSON files, one per theme (minimal, editorial, ...)
  docs/
    ARCHITECTURE.md       # this file
    THEME_SCHEMA.md
    API_CONTRACT.md
  .claude/
    commands/             # /new-theme, /new-section, /api-resource, /review
    mcp.json
  CLAUDE.md
  package.json            # workspaces: ["apps/*", "libs/*"]
  tsconfig.base.json      # path aliases shared across apps
```

Path aliases in `tsconfig.base.json` so apps import shared code cleanly:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@portfolio/shared-types": ["libs/shared-types/src/index.ts"],
      "@portfolio/theme-engine": ["libs/theme-engine/src/index.ts"],
      "@portfolio/themes/*":     ["libs/themes/*"]
    }
  }
}
```

## 3. apps/api (NestJS) — structure

Follows rone-api conventions; gaps from rone-api are filled in.

```
apps/api/
  src/
    pages/
      auth/               # admin login, JWT strategy, guards (mirror rone-api)
      projects/           # portfolio Projects CRUD
      skills/
      experience/
      themes/             # list/get/activate themes; admin-only mutations
      settings/           # site-wide settings (singleton document)
      media/              # image uploads (S3-compatible or local in dev)
    schema/               # raw mongoose.Schema() — flat, like rone-api
      project.schema.ts
      skill.schema.ts
      experience.schema.ts
      theme.schema.ts
      settings.schema.ts
      admin.schema.ts
    dto/                  # class-validator DTOs — flat, like rone-api
      project.dto.ts
      skill.dto.ts
      ...
      common/
        pagination.dto.ts
        filter.dto.ts
        response-payload.interface.ts
    decorator/            # @GetAdmin, @AdminMetaRoles, @AdminMetaPermissions
    guards/               # AdminJwtAuthGuard, AdminRolesGuard, AdminPermissionGuard
    pipes/                # MongoIdValidationPipe
    filters/              # AllExceptionsFilter (NEW vs rone-api)
    config/
      configuration.ts
      env.validation.ts   # joi schema for env (NEW vs rone-api)
    main.ts
    app.module.ts
  test/
  package.json
```

**Three additions vs rone-api**, all justified:

A global `AllExceptionsFilter` that maps every thrown exception to the `ResponsePayload` envelope, so the API never returns the default Nest error shape. This makes the Angular client trivially simple.

A `joi` schema in `config/env.validation.ts` that validates `MONGO_URI`, `JWT_SECRET_ADMIN`, etc. on startup. Saves you from a runtime crash six months from now when a `.env` drifts.

`@nestjs/swagger` enabled at `/api/docs`. The OpenAPI JSON is committed into `docs/openapi.json` and is loaded into the claude.ai Project knowledge base — Claude generating client code becomes dramatically more accurate.

## 4. apps/ui (Angular public) — structure

Mirrors rone-ui exactly, simplified for portfolio domain.

```
apps/ui/src/app/
  core/                   # singleton services, layout shell, header/footer
  shared/
    components/           # confirm-dialog, toast, loaders
    directives/
    pipes/
    shared.module.ts
  material/               # MaterialModule barrel (like rone-ui)
  services/
    common/
      project.service.ts
      skill.service.ts
      experience.service.ts
      theme.service.ts        # NEW: fetches active theme, switches at runtime
      settings.service.ts
  pages/
    home/                 # hero + featured projects
    projects/             # list + detail (lazy)
    about/
    contact/
  enum/
  interfaces/             # mirrors rone-ui style; will re-export from @portfolio/shared-types
  auth-interceptor/       # only needed if UI has authed actions (e.g. contact form rate limiting)
  app-routing.module.ts
  app.module.ts
src/theme/
  _variables.scss         # SCSS variables (kept for back-compat with Material)
  _base.scss
  _theme-css-vars.scss    # NEW: CSS custom properties driven by the theme JSON
  material/
src/environments/
src/styles.scss
```

**One key addition vs rone-ui:** themes are applied at runtime by setting CSS custom properties on `:root`. SCSS variables are kept (Material needs them at compile time), but the *portfolio's* visual tokens — colors, spacing, type scale, radii — live as CSS custom properties so they can be swapped without rebuilding. The `theme-engine` library does the swap.

## 5. apps/admin (Angular admin) — structure

Mirrors rone-admin closely.

```
apps/admin/src/app/
  admin-auth/             # login (reactive form, custom 'administrator' header)
  auth-guard/             # AdminAuthGuard, AdminAuthStateGuard
  auth-interceptor/       # injects 'administrator' header
  enum/
  interfaces/
  material/
  pages/
    dashboard/
    projects/
      all-projects/       # list + filter + paginate
      add-project/        # add or edit (paramless = create, :id = edit)
      project-routing.module.ts
    skills/
    experience/
    themes/               # NEW: theme picker + theme editor + live preview
    settings/
  services/
    admin/                # AdminService (auth, role, permissions)
    common/               # ProjectService, SkillService, ThemeService, ...
  shared/
    components/           # ConfirmDialogComponent, SnackbarNotificationComponent
    lazy/                 # lazy dropdowns (e.g. tag/skill multi-select)
    dialog-view/
  core/utils/
  app-routing.module.ts
  app.module.ts
```

Inside `pages/themes/` lives the only meaningfully new admin feature compared to rone-admin: a theme manager that lists themes, lets you activate one (writes to `Settings.activeThemeId` via the API), and provides a live preview iframe pointing at the public UI with the theme overridden via query param.

## 6. libs/theme-engine — what it does

Pure TypeScript, framework-agnostic so admin and ui can both use it. The engine is ~150 lines:

```ts
// libs/theme-engine/src/index.ts
export interface ThemeTokens { /* see THEME_SCHEMA.md */ }

export function applyTheme(tokens: ThemeTokens, target: HTMLElement = document.documentElement): void {
  const flat = flattenToCssVars(tokens);                          // { '--color-bg': '#fff', ... }
  for (const [k, v] of Object.entries(flat)) target.style.setProperty(k, v);
  target.dataset.theme = tokens.id;
}

export function loadStoredTheme(): string | null {
  return localStorage.getItem('portfolio.theme');
}

export function rememberTheme(id: string): void {
  localStorage.setItem('portfolio.theme', id);
}
```

Angular wraps it in a `ThemeService` that fetches the active theme from the API on bootstrap, falls back to the locally-stored preference, and finally to a built-in default. SCSS files reference `var(--color-bg)`, `var(--space-3)`, `var(--radius-md)`, `var(--font-display)`, etc., never hard-coded values. Adding a new theme is then literally dropping a JSON in `libs/themes/` and registering it.

## 7. CLAUDE.md (repo-root) — what it should contain

A working `CLAUDE.md` for this repo would document: the monorepo layout, the two essential commands per app (`dev`, `test`), the conventions above (NgModule, kebab-case files, `ResponsePayload` envelope, `class-validator` DTOs, raw Mongoose schemas), the theme system in one paragraph, branch naming (`feat/`, `fix/`, `chore/`), and commit style (Conventional Commits). We'll generate this when we scaffold the repo.

## 8. What we're carrying over verbatim vs adapting

Carrying over: NgModule + lazy loading, the dual-guard auth pattern, the HTTP interceptor pattern, the `ResponsePayload` envelope, raw Mongoose schemas, flat `schema/` and `dto/` folders, feature modules under `pages/`, the SCSS theme folder with Material customization, the Material barrel module, RxJS-only state, `class-validator` DTOs, the JWT + role + permission guard chain, the `apiBaseLink` environment pattern.

Adapting: replacing e-commerce domain models (Product, Order, Cart, Brand, Category) with portfolio domain models (Project, Skill, Experience, Theme, Settings); admin sidebar menu items renamed accordingly; SCSS color variables redefined for the portfolio brand.

Adding: theme engine and CSS-custom-property-driven theming (the headline portfolio feature), Swagger/OpenAPI on the API, a global exception filter, env validation, TypeScript strict mode, ESLint + Prettier configs committed, path aliases via tsconfig, npm workspaces monorepo, GitHub Actions CI.

## 9. Sign-off checklist

Before we move to scaffolding in Claude Code, you should confirm: monorepo with npm workspaces is fine (vs three separate repos like today); strict TypeScript is OK; Angular 17 with NgModules (not standalone) matches your style; the theme engine approach (CSS custom properties driven by a theme JSON) is what you want; the Swagger/exception-filter/env-validation additions are wanted. If any of these are wrong for you, we adjust here, in this doc, before any code is written.
