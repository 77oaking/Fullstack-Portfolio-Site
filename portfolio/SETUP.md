# Setup — start to finish

This is the runbook. Read top to bottom on first run; come back to specific sections later.

## 0. Prerequisites

You need three things on your machine.

**Node.js 18.18 or later.** Check with `node --version`. If missing, install from nodejs.org.

**Git.** Already present since you cloned the repos earlier.

**MongoDB.** Two equally good options. (a) **MongoDB Atlas free tier** — sign up at mongodb.com/atlas, create a free M0 cluster, add your IP to the allowlist, copy the connection string. Easiest. (b) **Local install** — install MongoDB Community Server from mongodb.com/try/download/community and let it run as a service. Faster locally; no network setup.

## 1. Run the setup script

From the repo root in PowerShell:

```powershell
cd "E:\Project\FullStack Portfolio\portfolio"
.\scripts\setup.ps1
```

Or in Git Bash / WSL:

```bash
cd "/e/Project/FullStack Portfolio/portfolio"
./scripts/setup.sh
```

The script does five things, in order:

1. Verifies Node is on the PATH.
2. Moves `claude-config/` → `.claude/` (the protected folder couldn't be created directly during scaffolding).
3. Copies `apps/api/.env.example` → `apps/api/.env`. **Pauses for you to edit it.**
4. Runs `npm install` at the root, which installs every workspace.
5. Optionally runs `npm run seed` to create the admin user, the two built-in themes, and the Settings document.

## 2. Edit `apps/api/.env`

When the script pauses, open `apps/api/.env` and fill in five values:

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/portfolio
# or for local: mongodb://127.0.0.1:27017/portfolio

JWT_SECRET_ADMIN=<48-byte hex string>
# generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

ADMIN_USERNAME=admin
ADMIN_PASSWORD=<at least 8 chars; you'll log in to admin with this>
ADMIN_NAME=<your name; shown in the admin sidebar>
```

`CORS_ORIGINS` is already set to `http://localhost:4200,http://localhost:4300` for dev. Leave the SMTP block empty — the contact form just stores messages until you wire up email.

Save and press Enter in the script.

## 3. The script runs `npm install`

This will take 3-7 minutes on first run (Angular + Material + NestJS = a lot of packages). You'll see deprecation warnings — those are normal and not actionable.

## 4. Seed the database

When prompted, answer `y`. The seed script:

- Creates the admin user with the username/password from `.env`.
- Upserts the two built-in themes (`minimal-light`, `editorial-serif`) from `libs/themes/*.json` into the `themes` collection.
- Creates a singleton Settings document with `activeThemeId: "minimal-light"`.

Re-running `npm run seed` is safe — it skips existing records and only updates theme docs.

## 5. Start everything

```powershell
npm run dev
```

You should see three colored output streams:

| App   | Port | URL                                  |
|-------|------|--------------------------------------|
| api   | 4001 | http://localhost:4001/api/docs       |
| ui    | 4200 | http://localhost:4200                |
| admin | 4300 | http://localhost:4300                |

The first time the API boots, it'll log "API listening on http://localhost:4001". The first Angular build takes ~30s; subsequent rebuilds are sub-second.

## 6. First login

Open http://localhost:4300, sign in with the username/password you set in `.env`. You should land on the Dashboard with three counters (Projects, Themes, Active theme). Visit /themes — you'll see Minimal Light + Editorial Serif and can switch between them. The right pane previews each theme live.

Visit http://localhost:4200 — the public site renders with whichever theme is currently active.

## 7. Troubleshooting

**"MONGO_URI is required" / boot error.** `.env` isn't there or `MONGO_URI` isn't set. Re-check `apps/api/.env`.

**"E11000 duplicate key error" on seed.** The admin user already exists. The seed script handles this gracefully on subsequent runs, but if you see it on the first run, change `ADMIN_USERNAME` in `.env` and re-seed.

**Login returns "Invalid credentials".** Either the username doesn't match `.env`, or the password was already bcrypt-hashed in the DB before you changed `.env`. Connect to Mongo and `db.admins.deleteMany({})`, then re-seed.

**`npm run dev` only starts one app.** That's `concurrently` waiting on the slowest dependency install. Run `npm install` again at the root and retry.

**Angular build fails with "Cannot find module '@portfolio/shared-types'".** The workspace symlinks didn't form. Run `npm install` at the repo root again — that's where the workspace resolution happens.

**Port already in use.** Either kill the process on that port, or change the port in `apps/<app>/package.json` (the `dev` script).

**Swagger 404.** API isn't fully started yet — wait for the "Swagger docs:" log line.

## 8. Moving to Claude Code

Once `npm run dev` works end to end, you're ready to switch to Claude Code for ongoing feature work. From this folder:

```powershell
claude
```

That opens Claude Code with the repo's `CLAUDE.md` automatically loaded. Try:

- `/new-resource Skill` — scaffolds a fully-wired Skills resource (schema + DTO + module + controller + service) following the Projects pattern.
- `/new-theme Aurora` — kicks off a new theme JSON.
- `/review` — runs lint + tests + shows the diff.

These slash commands live in `.claude/commands/` and are markdown files you can edit any time.

## 9. Common day-to-day commands

```bash
npm run dev               # all three apps
npm run dev:api           # API only
npm run dev:ui            # public UI only
npm run dev:admin         # admin only
npm run seed              # (re-)seed Mongo
npm run validate-themes   # check libs/themes/*.json
npm run lint              # all workspaces
npm run format            # prettier across the repo
npm run build             # production build of all three
```
