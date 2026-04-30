# Building Your Themeable Portfolio With Claude — End-to-End Guide

Stack you've chosen: **Angular (UI)** + **NestJS (API)** + **MongoDB (DB)**, with a separate **Admin** surface, plus a theme system where users pick a theme and you can drop in new themes you design later.

This guide walks through how to actually use Claude — every surface (claude.ai Projects, Artifacts, Claude Code, Cowork, Connectors, Plugins, Skills) — for *this specific project*, then moves to architecture, build steps, and deployment. It's written so you can read top-to-bottom once and then jump back to any section as a reference.

---

## 1. The mental model: which "Claude" for which job

There are several Claude products. They aren't competitors — they're tools for different points in the workflow. Use the right one for the moment.

**claude.ai (web/desktop chat).** Good for thinking, planning, design discussions, drafting copy/READMEs/specs, generating one-off code snippets, looking at attached files, and running Artifacts for visual prototypes. This is where you live during *design and ideation*. Projects (described below) live here.

**Claude Code (CLI in your terminal).** This is the workhorse for *actually building software*. It runs inside your repo, can read/write files, execute commands, run tests, commit code, and use plugins/MCP servers. This is where most of the portfolio implementation will happen.

**Cowork (the desktop app you're talking to me in right now).** A Claude desktop tool with file access to a folder you select, a sandboxed Linux shell, and the ability to use skills/plugins/MCP. It's the "general computer assistant" form — not specialized for big multi-file refactors the way Claude Code is, but excellent for cross-app tasks (your file system, browsers, native apps), generating documents, and small file edits. Use it for setup tasks, generating designs, and producing artifacts/decks.

**Claude API.** You'd only need this if you wanted Claude *inside* your app (e.g., an AI assistant on your portfolio). Out of scope for the build itself, but worth knowing it exists.

A simple rule for this project: **plan in claude.ai → build in Claude Code → use Cowork for cross-cutting tasks** (file org, document generation, screenshots, deployment dashboards).

---

## 2. Setting up claude.ai Projects

A Project in claude.ai is a folder-shaped chat space with three things attached: persistent **custom instructions** (a system prompt for every chat in that project), a **knowledge base** (files Claude always sees), and the **chat history** of every conversation in that project. Projects don't run code — they're for thinking and writing.

For your portfolio, create **one umbrella Project** called *"Portfolio Platform"*. A single project is better than three separate ones because the UI/API/Admin pieces share contracts (theme schema, content types, auth) — you want Claude to see all of that together when you ask cross-cutting questions.

Inside the Project's custom instructions, paste a short system prompt describing the stack, your conventions, and your priorities. Something like: "You are helping me build a portfolio platform. Stack: Angular 17 standalone components + signals, NestJS with Mongoose, MongoDB Atlas. Three deployables: public UI, admin UI, API. Themes are JSON-driven. Prefer TypeScript strict mode, ESLint Airbnb, conventional commits. When generating code, match the existing folder structure in the knowledge base."

Into the knowledge base, attach: your **theme schema** once it's drafted, an **architecture doc** (we'll generate one from your existing repos), the **API contract** (OpenAPI/Swagger JSON once NestJS is scaffolded), and your **coding conventions**. Refresh these files as the project evolves — outdated knowledge is worse than no knowledge.

Practical tip: start every meaningful working session with a fresh chat in the Project rather than continuing a single mega-thread. Long threads drift. Short threads with a clear goal stay sharp.

---

## 3. Artifacts — what they're for

Artifacts are interactive HTML/React/SVG/Markdown files that render live inside a Claude chat. For your portfolio, they're useful for three things specifically:

**Theme previews.** When you (or Claude) propose a theme, an Artifact can render a sample portfolio page styled with that theme so you can eyeball it before wiring it into Angular. Iterating on colors, type scale, and spacing in an Artifact is dramatically faster than a full Angular dev loop.

**Component prototypes.** Hero sections, project cards, contact forms — sketch them as React/HTML Artifacts first, lock the design, then port to Angular.

**Schema explorers.** A small interactive page that takes a theme JSON and renders a preview, so anyone (including future-you) can see what each theme token does.

Artifacts are sandboxed: no `localStorage`, single file, can't talk to your real API. Treat them as design-time tools, not production code.

---

## 4. Claude Code — install and use it for the build

Claude Code is the CLI you'll spend the most actual *coding* time in. Install it once, then run it inside each repo (or a monorepo).

Install with `npm install -g @anthropic-ai/claude-code` and authenticate with `claude` (it'll walk you through OAuth). Inside a repo, just run `claude` and start chatting. It can read every file, run shells, edit code, run tests, and commit.

Three things to set up the first time you open the portfolio repo in Claude Code:

**A `CLAUDE.md` at the repo root.** This is the equivalent of a Project's custom instructions, but lives in the repo so anyone (and any Claude session) sees it. Document the stack, the folder layout, the commands (`npm run dev`, `nest start`, `ng serve`, the test command), the theme system, branch conventions, and anything non-obvious. A good `CLAUDE.md` is the single highest-leverage thing you can do — Claude becomes drastically more useful in a repo that explains itself. You can bootstrap one with the built-in `/init` slash command.

**Slash commands for repeatable work.** Things like `/new-theme <name>` (scaffold a theme JSON + register it), `/new-section <name>` (generate an Angular component, route, and admin editor), `/api-endpoint <resource>` (add a NestJS controller/service/DTO/Mongoose schema), `/review` (run lint + tests + diff review), `/security-review` (you already have this one available). Slash commands are just markdown files in `.claude/commands/` — Claude reads the file as the prompt when you type the command.

**Hooks for guardrails.** Pre-tool-use hooks can run `npm run lint` or `npm test` before allowing a commit. Post-tool-use hooks can format on save. You configure these in `.claude/settings.json`. For a portfolio you don't need many — start with format-on-write and lint-before-commit.

When *building*, the typical loop is: open Claude Code in the repo, describe the next vertical slice ("add a Projects collection: Mongoose schema, NestJS CRUD, Angular list + detail, admin editor"), let it draft, review the diff, run tests, iterate. Don't accept big multi-file changes blindly — read the diffs.

---

## 5. Cowork — what you use it for

Cowork (this app) shines for **anything that touches your real computer** — your file system, your browser, native apps — and for **document generation**. For the portfolio:

It's the right place to **organize your `E:\Project\FullStack Portfolio` folder**, copy assets between repos, generate the architecture/design docs we're building, run the deployment dashboards, take screenshots of running apps for the portfolio itself, and drive cross-app workflows (e.g., "open Figma, take a screenshot of frame X, drop it into the Angular assets folder").

It's *not* the right place to do day-to-day coding on a multi-file Angular app — that's Claude Code. But it's where this guide gets written, where I'll analyze your existing GitHub repos and produce architecture docs, and where we'll generate a deployment playbook PDF later.

---

## 6. Connectors (MCP servers) — connect Claude to your services

Connectors are MCP servers that give Claude tools to talk to external services (GitHub, Slack, MongoDB, Google Drive, Linear, etc.). They turn "I think your code looks like X" into "Here's the actual file from your repo." For this project, three are high-value:

**GitHub.** This is essential. Once connected, Claude can read your existing portfolio/structure repos, open PRs against the new portfolio repo, review diffs, manage issues. This is how I'll analyze the "already built structure" you mentioned.

**MongoDB (or a generic database connector).** Lets Claude inspect your real data shape during development — useful when iterating on theme or content schemas. Optional but nice.

**Filesystem / Drive.** If you have design files (Figma exports, mood boards, copy docs) in Google Drive or a local folder, connecting it lets Claude pull them into prompts directly.

In Cowork (here), you connect MCP servers from settings. In Claude Code, you add them to `.claude/mcp.json`. In claude.ai web, Connectors are managed under Settings → Connectors. The same MCP server can be used from all three surfaces.

---

## 7. Plugins — bundles of MCPs/skills/commands

A plugin is a packaged bundle: one or more MCP servers, skills, slash commands, and config, distributed together. You install one plugin and you get the whole stack of capabilities at once.

For your portfolio, the most useful plugin shapes are:

**A "Web Dev" plugin** that ships with linters, formatters, deployment tools, and a few skills (e.g., a "Tailwind audit" skill, an "Angular component generator" skill). You'd install it in Claude Code so every web project gets the same toolbox.

**A custom plugin you build for *this* project** — a `.plugin` file with: an `angular-component` skill (knows your conventions), a `nest-resource` skill (scaffolds controller/service/schema/DTO), a `theme-from-image` skill (extracts a palette + type scale from a reference image and writes a theme JSON), and a slash command `/new-feature` that orchestrates them. Cowork has a built-in `create-cowork-plugin` skill for this — we'll use it later.

You don't need plugins on day one. Build the project, notice repeated patterns, then bundle the patterns into a plugin so future-you (or future projects) get them for free.

---

## 8. Skills — Claude's specialized "playbooks"

A skill is a folder with a `SKILL.md` and (optionally) supporting scripts/templates. When the skill's description matches what you're doing, Claude reads the SKILL.md and follows the playbook. Built-in ones available right now include `docx`, `pdf`, `pptx`, `xlsx`, `schedule`, `skill-creator`, plus the cowork plugin management skills.

For the portfolio, the skills you'll lean on most:

**docx, pdf, pptx, xlsx** — generate the case-study PDFs, project decks, content matrices, and any printable artifacts your portfolio links to.

**skill-creator** — when you find yourself repeating a workflow (e.g., "scaffold a new theme"), use skill-creator to turn it into a permanent skill. Then it's one prompt away forever.

**Custom skills you'll write for this project:**

- `theme-create` — generates a new theme JSON from either a description ("warm sunset, serif headers, lots of negative space") or a reference image. Validates against your theme schema. Drops it in the right folder.
- `angular-section` — scaffolds a new portfolio section (component + route + admin editor + sample content).
- `nest-resource` — adds a Mongoose schema, NestJS module, controller, service, DTOs, and an OpenAPI tag.
- `case-study` — given a project name, drafts the markdown case study from a template, generates the hero image prompt, and slots into the CMS.

We'll build these as we go, not upfront — premature skills get stale.

---

## 9. The actual workflow for *this* portfolio

Now, the build sequence — what we'll do in what order. This is concrete to your stack.

### Phase 1 — Discover and analyze (here, in Cowork)

You point me at the existing GitHub repo(s). I connect via the GitHub connector and produce three documents inside `E:\Project\FullStack Portfolio\docs\`:

- `ARCHITECTURE.md` — folder layout, module structure, naming conventions extracted from your existing code, plus a recommended layout for the new portfolio that *matches* your conventions.
- `THEME_SCHEMA.md` — the JSON schema for a theme (color tokens, typography scale, spacing scale, radii, motion, optional component overrides), plus two example themes ("Minimal Light" and "Editorial Serif") rendered as Artifacts so you can eyeball them.
- `API_CONTRACT.md` — the OpenAPI-style spec for Projects, Skills, Experience, Themes, Settings, Auth.

These three docs become the knowledge base attached to your claude.ai Project.

### Phase 2 — Scaffold (Claude Code, in the repo)

In Claude Code, scaffold a monorepo with three apps. The shape I'd recommend:

```
portfolio/
  apps/
    api/          # NestJS
    ui/           # Angular (public)
    admin/        # Angular (auth-gated)
  libs/
    shared-types/ # TS interfaces shared by all three
    theme-engine/ # Pure TS: applies a theme JSON to CSS variables
    themes/       # JSON files, one per theme
  docs/
  .claude/
    commands/
    mcp.json
  CLAUDE.md
```

Use Nx or a simple npm workspaces setup. Nx is heavier but gives you generators and dependency graphs; npm workspaces is lighter and fine for three apps.

### Phase 3 — Theme engine first

Before any portfolio sections, build the theme engine. It's a tiny pure-TypeScript library: takes a theme JSON, sets CSS custom properties on `:root`, exposes a `useTheme()` for switching at runtime. Persist the chosen theme to localStorage and (for logged-in users) the API. Build this with three example themes so you can switch and verify everything reflows. Get this *right* now and adding themes later is trivial.

### Phase 4 — Content model + API

NestJS modules for `Projects`, `Experience`, `Skills`, `Settings`, `Themes`, `Auth` (JWT, admin only). Mongoose schemas for each. OpenAPI exposed at `/api/docs`. Save the OpenAPI JSON into your knowledge base — Claude using that becomes much more accurate.

### Phase 5 — Public UI sections

Build them one at a time as vertical slices. Each section is a route + a component + a content type in the API + sample data. Don't build five half-done sections; build one all-the-way-through, ship it locally, then the next.

### Phase 6 — Admin UI

Auth-gated Angular app that's basically a CRUD interface against the API plus a theme picker/editor. Reuse the theme engine here — admin should *also* respect the chosen theme so you can preview while editing.

### Phase 7 — Deployment (see section 11)

### Phase 8 — Add new themes and sections

This is the payoff for doing the theme engine and content model right early. New theme = drop a JSON in `libs/themes/`, register it. New section = run the `angular-section` skill we built in phase 4–5. Both should take minutes, not hours.

---

## 10. How I'll use your existing GitHub repo

When you give me the URL(s), here's exactly what happens:

I connect via the GitHub connector and clone (or read via API) the repo. I run a structural analysis: folder tree, package.json scripts, Angular module graph, NestJS module graph, Mongoose schemas, naming conventions, ESLint/Prettier configs, test setup. I produce `ARCHITECTURE.md` describing what you do today, then a side-by-side **Recommended Structure** showing where the new portfolio will deviate (and *why* — usually because portfolios need a theme system and a content CMS-shape that your existing project might not have).

You review `ARCHITECTURE.md`. We adjust. Once you sign off, that file feeds the scaffolding step.

---

## 11. Deployment recommendations for Angular + NestJS + MongoDB

You said "recommend later" — here's the recommendation, since the choice affects how we structure config from day one.

The cleanest path for this stack and a solo developer is:

**MongoDB Atlas (free M0 tier)** for the database. No infra to manage, free for portfolio scale, hosted in a region near your API.

**Render or Railway** for the NestJS API. Both have generous free tiers, deploy from GitHub on every push to `main`, handle TLS, give you logs and metrics. Render's free tier sleeps after inactivity (cold starts ~30s); Railway charges a few dollars but stays warm. For a portfolio with occasional traffic, Render free is fine.

**Vercel or Cloudflare Pages** for the Angular UI and Admin. Both deploy from GitHub on push, give you preview URLs per branch, and handle TLS/CDN. Cloudflare Pages is faster globally and has higher free limits; Vercel has a slightly nicer DX. Either works.

**GitHub Actions for CI**: lint + test + typecheck on every PR, deploy on merge to `main`. We'll generate the workflows when we get there.

DNS: point `yourdomain.com` to the UI, `admin.yourdomain.com` to the admin, `api.yourdomain.com` to the API. Cloudflare DNS is free and fast.

Cost at portfolio scale: $0–$5/month depending on whether you keep the API warm.

---

## 12. Practical ground rules for working with Claude on this project

A few habits that make Claude dramatically more useful, learned the hard way:

**Keep `CLAUDE.md` honest and current.** When you change conventions, update it the same commit. Stale instructions are worse than none.

**Work in vertical slices.** "Add Projects feature end-to-end" is a much better prompt than "make the database schema." Claude is best when given an outcome, not a step.

**Read the diffs.** Claude Code will happily edit twelve files. Look at all twelve before committing. Use `git diff` and the `/review` slash command.

**Use Artifacts for design before code.** Five minutes in an Artifact saves an hour of Angular rebuild loops.

**Refresh the Project knowledge base monthly.** Re-export OpenAPI, regenerate the architecture doc, drop in updated theme schema. The knowledge base goes stale fastest in active projects.

**One Project, many short chats.** Don't run a marathon thread; start a fresh chat per task and let the Project knowledge carry context.

**Commit before letting Claude do something risky.** Migrations, big refactors, dependency upgrades. A clean git state means rolling back is one command.

---

## 13. Where we go from here

Three things to do next, in order:

First, **point me at the GitHub repo(s)** you want analyzed. Paste the URL in chat. If the repos are private, I'll need the GitHub connector authorized for your account — I'll walk you through it.

Second, I'll produce `docs/ARCHITECTURE.md`, `docs/THEME_SCHEMA.md`, and `docs/API_CONTRACT.md` in this folder, with example themes rendered as Artifacts so you can see them.

Third, once you sign off on the architecture, we move to Claude Code in your repo and scaffold the monorepo.

When you're ready, drop the repo URL.
