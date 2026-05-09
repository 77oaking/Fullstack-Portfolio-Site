# Portfolio Platform

A themeable personal portfolio. Three deployables:

- `apps/api` — NestJS + MongoDB (the only place data lives).
- `apps/admin` — auth-gated Angular admin (you fill in every section here).
- `apps/ui-default` — the first public theme. To make a second theme, copy this folder to `apps/ui-<name>` and re-skin.

Plus shared types in `libs/shared-types`.

## What got rebuilt

This repo was reset to a clean, opinionated structure:

- One canonical data model in `libs/shared-types/src/index.ts` (Profile, Hero, About, Experience, Education, SkillCategory, Project, Service, Testimonial, Certification, Achievement, BlogPost, ContactMessage, SiteSettings).
- API exposes `GET /api/portfolio` returning the full bundle in one round-trip — that's what the public UI consumes.
- Admin has a "vast" form per section + a Danger Zone with a confirmable **Reset all data** button (hits `POST /api/admin/reset` with `{ "confirm": "RESET" }`).
- Public UI is one home page that composes a separate standalone Angular component per section. Lists render dynamically — add a 4th experience in admin and the UI grows automatically.
- Angular convention is **standalone components + signals**, no NgModules.

## First-time setup

1. **Install:**
   ```bash
   npm install
   ```

2. **Configure the API:** copy `apps/api/.env.example` to `apps/api/.env` and set:
   ```env
   MONGO_URI=mongodb+srv://...
   JWT_SECRET_ADMIN=<32+ char secret>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<min 8 chars>
   ADMIN_NAME=Your Name
   PORT=4001
   CORS_ORIGINS=http://localhost:4200,http://localhost:4300
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```
   Creates the admin user and demo Profile / Hero / About / Experience / Education / Skills / Projects / Services / Settings.

4. **Run all three apps:**
   ```bash
   npm run dev
   ```
   - API → http://localhost:4001/api  (Swagger at `/api/docs`)
   - Public UI → http://localhost:4200
   - Admin → http://localhost:4300

   Or run individually with `npm run dev:api`, `npm run dev:ui`, `npm run dev:admin`.

5. **Sign in to the admin** with the credentials from `.env`. Fill in every section — changes are live in the public UI on the next reload.

## Adding a new theme

```bash
cp -r apps/ui-default apps/ui-<your-name>
```

Then edit `apps/ui-<your-name>/src/styles.scss` — change the CSS custom properties (`--accent-1`, `--accent-2`, fonts, radii, etc.). The data model and API stay untouched. Add a script entry in the root `package.json` if you want a dedicated `npm run dev:<theme>`.

## Cleanup of legacy files

The previous scaffolding (CV-style API + NgModule admin + the old `apps/ui`) is excluded from the TypeScript build but the files still exist on disk. To delete them:

```powershell
cd "E:\Project\FullStack Portfolio\portfolio"
powershell -ExecutionPolicy Bypass -File .\scripts\cleanup-orphans.ps1
```

After that you can also drop the corresponding `exclude` blocks from `apps/api/tsconfig.json` and `apps/admin/tsconfig.app.json` to simplify the configs.

## Reset everything

In the admin sidebar → **Danger** → **Reset Data**. Type `RESET` and click the button. It deletes every portfolio collection (profile, hero, about, experiences, educations, skill categories, projects, services, testimonials, certifications, achievements, blog posts, contact messages, settings). Your admin user is preserved.

You can also trigger it from anywhere with:

```bash
curl -X POST http://localhost:4001/api/admin/reset \
  -H "administrator: <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"confirm":"RESET"}'
```

## Data flow at a glance

```
[Admin form]  → PUT /api/<section>      → Mongo
                                          ↓
[ui-default]  ← GET /api/portfolio     ← reads everything in one bundle
```

Every field on every admin form maps 1:1 to a Mongoose document, which maps 1:1 to a TypeScript type in `libs/shared-types`, which is the same type the UI imports. No silent drift between layers.
