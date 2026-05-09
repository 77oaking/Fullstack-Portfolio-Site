# CLAUDE.md — Portfolio Platform

This file is read by Claude at the start of every session in this repo. Keep it short, current, and honest.

## What this is

A themeable personal portfolio platform. The data model is fixed and admin-driven. The public UI is theme-folder-based: every theme is its own Angular app under `apps/ui-<theme>/`, all consume the same API.

- `apps/api` — NestJS 10 backend, MongoDB via Mongoose. Single-admin auth, JSON envelope responses.
- `apps/admin` — Auth-gated Angular 17 admin (standalone components + signals). One vast form per portfolio section.
- `apps/ui-default` — First public theme (Aurora teal/green). Pure presentation layer over the API.

Add a new theme by copying `apps/ui-default` to `apps/ui-<name>` and re-skinning the components. The data shape never changes.

Plus internal libraries:

- `libs/shared-types` — Single source of truth for every entity (Profile, Hero, Experience, Education, Skills, Projects, Services, Testimonials, Certifications, Achievements, Blog, Contact, Settings, Admin).

## Conventions (non-obvious)

- **Angular: standalone components + signals.** No NgModules. Use `inject()` over constructor DI. Lazy-load via `loadComponent` in routes.
- **Bootstrap with `bootstrapApplication`** + `provideRouter`, `provideHttpClient`, `provideAnimations`. Each Angular app has one `main.ts` doing this.
- **NestJS: feature modules under `src/pages/<feature>/`.** Schemas flat under `src/schema/`. DTOs flat under `src/dto/`. Each feature has module + controller + service + DTOs.
- **Mongoose schemas use raw `new mongoose.Schema()`**, not `@Schema()` decorators. `timestamps: true`, `versionKey: false`.
- **Auth: admin only.** Admin token is sent in a custom header named `administrator` (not `Authorization`). Single-admin model.
- **Response envelope on every API response:** `{ success, data?, count?, message?, errorCode? }`. Errors go through `AllExceptionsFilter`.
- **Validation:** `class-validator` on every DTO. `MongoIdValidationPipe` on every `:id` route param.
- **Reset endpoint:** `POST /api/admin/reset` wipes every portfolio collection (Profile, Hero, About, Experience, Education, Skills, Projects, Services, Testimonials, Certifications, Achievements, Blog, ContactMessage). The admin user record is preserved.
- **TypeScript strict mode is on everywhere.**
- **File naming: kebab-case.** Class naming: PascalCase + role suffix.

## Theme tokens (ui-default)

CSS custom properties live in `apps/ui-default/src/styles.scss`. Colors:

- Accent: `--accent-1: #0EA5A4` (teal), `--accent-2: #22C55E` (green), `--accent-1-dark: #0F766E`, `--accent-soft: #E6FAF7`.
- Surfaces: `--bg: #fff`, `--bg-alt: #f6f9fb`, `--bg-soft: #eef3f7`, `--card-bg: #fff`.
- Text: `--text-1: #0f172a`, `--text-2: #475569`, `--text-3: #94a3b8`.
- Border: `--border: rgba(15,23,42,0.08)`.
- Fonts: `Plus Jakarta Sans` (body), `Sora` (display).

A new theme overrides only these tokens — no component code changes needed unless the layout itself changes.

## Commands

| Action               | Command                              |
|----------------------|--------------------------------------|
| Install              | `npm install` at repo root           |
| Run all              | `npm run dev`                        |
| Run API only         | `npm run dev:api`                    |
| Run ui-default only  | `npm run dev:ui`                     |
| Run admin only       | `npm run dev:admin`                  |
| Seed DB              | `npm run seed`                       |
| Lint everything      | `npm run lint`                       |
| Build all            | `npm run build`                      |

## Where things live

```
portfolio/
  apps/
    api/         src/{config,filters,guards,pipes,decorator,schema,dto,pages}/...
    admin/       src/app/{core,shared,services,pages,guards,interceptors}/...
    ui-default/  src/app/{core,shared,services,sections,pages}/...
  libs/
    shared-types/src/  -> Profile, Hero, About, Experience, Education, SkillCategory,
                          Project, Service, Testimonial, Certification, Achievement,
                          BlogPost, ContactMessage, SiteSettings, Admin, ResponsePayload
  scripts/
    seed.ts cleanup-orphans.ps1
```

## Adding things — quick reference

- **New API resource:** copy any folder under `apps/api/src/pages/`. Schema → DTO → Service → Controller → register in `app.module.ts`. Use `@UseGuards(AdminJwtAuthGuard)` on mutating routes.
- **New section in ui-default:** drop a standalone component under `apps/ui-default/src/app/sections/<name>/`. Inject the matching service from `services/`. Render it in `pages/home/home.component.ts`.
- **New theme:** copy `apps/ui-default` to `apps/ui-<name>`, change `--accent-*` and font tokens in `styles.scss`, restyle component templates as needed. Same data, same services.

## Don'ts

- Don't use NgModules — convention is standalone components.
- Don't use `@Schema()` decorators — convention is raw `new mongoose.Schema()`.
- Don't add `Authorization: Bearer` for admin — use the `administrator` custom header.
- Don't hard-code colors/spacing in SCSS — always `var(--token)`.
- Don't skip the `MongoIdValidationPipe` on `:id` params.
- Don't put theme-specific markup in shared services or shared-types.
- Don't let `apps/ui-*` know about other UI themes — each theme is an isolated app.
