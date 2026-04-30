# API Contract

The portfolio API is a NestJS service that mirrors the conventions of `rone-api` (raw Mongoose schemas, flat `class-validator` DTOs, Passport JWT with custom headers, `ResponsePayload` envelope). This document is the design-time contract — the source of truth before code is written. Once the API is scaffolded, `@nestjs/swagger` will generate `docs/openapi.json` from the actual decorators and that file becomes the running contract.

## 1. Conventions

**Base URL.** All routes are prefixed `/api/v1/` (URI versioning is enabled, matching rone-api). For example: `GET /api/v1/projects/:id`.

**Auth.** Two independent JWT strategies, exactly like rone-api. Admin requests carry the token under the custom header `administrator`; public-user requests (only used for the contact form rate-limiting and any future "favorite a project" feature) carry the token under `Authorization: Bearer <token>`. Most public endpoints are open. Mutating endpoints are admin-only.

**Response envelope.** Every response — success or error — has the same shape:

```ts
interface ResponsePayload<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;     // for list endpoints
  message?: string;   // human-readable; on errors, the failure reason
  errorCode?: string; // optional machine-readable error code (e.g. "UNIQUE_FIELD")
}
```

Errors return HTTP 4xx/5xx but always with this envelope, courtesy of the global `AllExceptionsFilter`. The Angular client's HTTP interceptor can therefore unwrap `res.data` blindly.

**Filter / pagination.** List endpoints accept a POST body of shape `FilterAndPagination` (matching rone-api). This is more flexible than query strings for nested filters and is consistent with your existing convention.

```ts
interface FilterAndPagination {
  filter?:     Record<string, unknown>;       // arbitrary mongo-shaped filter object
  pagination?: { pageNumber: number; pageSize: number };
  sort?:       Record<string, 1 | -1>;        // e.g. { createdAt: -1 }
  select?:     string | Record<string, 0 | 1>;
}
```

**Validation.** All bodies validated with `class-validator` DTOs. Path params hit a `MongoIdValidationPipe` that rejects non-24-char ObjectIds before the controller runs.

**ID type.** Every `_id` is a Mongo `ObjectId`, serialized as a 24-char hex string in JSON.

## 2. Resources at a glance

```
Auth         /api/v1/admin/(login|me|change-password)
Admin        /api/v1/admin/*                 # super-admin manages other admins
Projects     /api/v1/projects/*
Skills       /api/v1/skills/*
Experience   /api/v1/experience/*
Themes       /api/v1/themes/*                # active theme + theme catalog
Settings     /api/v1/settings                # singleton document
Media        /api/v1/media/upload            # image uploads
Contact      /api/v1/contact                 # public contact form (rate-limited)
```

## 3. Schemas

Mongoose schemas (raw `new mongoose.Schema()`, `timestamps: true`, `versionKey: false`).

### Project

```ts
interface Project {
  _id:         ObjectId;
  title:       string;       // required
  slug:        string;       // required, unique, kebab-case
  summary:     string;       // 1–280 chars, shown on cards
  description: string;       // markdown or HTML body
  coverImage:  string;       // URL
  gallery:     string[];     // additional image URLs
  tags:        string[];     // ["angular","nestjs","mongo"]
  techStack:   string[];     // structured tech list
  links:       { label: string; url: string }[];   // demo, repo, case study, ...
  featured:    boolean;      // shown on home
  order:       number;       // manual sort order, asc
  status:      'draft' | 'published' | 'archived';
  publishedAt: Date | null;
  createdAt:   Date;
  updatedAt:   Date;
}
```

### Skill

```ts
interface Skill {
  _id:         ObjectId;
  name:        string;          // required, unique
  category:    string;          // "frontend" | "backend" | "tooling" | etc.
  level:       1 | 2 | 3 | 4 | 5;  // 1 = beginner, 5 = expert
  yearsOfExperience: number;
  icon:        string | null;   // URL or icon-name
  order:       number;
  visible:     boolean;
  createdAt:   Date;
  updatedAt:   Date;
}
```

### Experience

```ts
interface Experience {
  _id:         ObjectId;
  role:        string;
  company:     string;
  companyLogo: string | null;
  location:    string;
  startDate:   Date;
  endDate:     Date | null;     // null = current
  summary:     string;
  bullets:     string[];        // 3–6 achievement bullets
  techStack:   string[];
  order:       number;
  visible:     boolean;
  createdAt:   Date;
  updatedAt:   Date;
}
```

### Theme

```ts
interface Theme {
  _id:         ObjectId;
  themeId:     string;          // matches Theme.id from THEME_SCHEMA.md, unique
  name:        string;
  description: string;
  preview:     string;
  mode:        'light' | 'dark';
  tokens:      ThemeTokens;     // see THEME_SCHEMA.md
  components:  ComponentOverrides | null;
  isBuiltIn:   boolean;         // bundled themes vs admin-created
  visible:     boolean;
  createdAt:   Date;
  updatedAt:   Date;
}
```

### Settings (singleton)

```ts
interface Settings {
  _id:           ObjectId;
  siteTitle:     string;
  siteTagline:   string;
  ownerName:     string;
  ownerHeadline: string;        // shown in hero
  ownerBio:      string;        // markdown
  ownerAvatar:   string;
  resumeUrl:     string | null;
  contactEmail:  string;
  social: {
    github?:   string;
    linkedin?: string;
    twitter?:  string;
    youtube?:  string;
    other?:    { label: string; url: string }[];
  };
  activeThemeId: string;        // references Theme.themeId
  seo: {
    metaTitle:       string;
    metaDescription: string;
    ogImage:         string;
  };
  createdAt:     Date;
  updatedAt:     Date;
}
```

### Admin

Mirrors `rone-api` exactly — `name`, `username` (unique), `password` (bcrypt-hashed), `role` (enum), `permissions` (string[]), `hasAccess`, `lastLoggedIn`, `readOnly`. No changes.

## 4. Endpoints

Below: method, path, auth, request shape, success response. Errors always follow the `ResponsePayload` envelope; common error shapes are listed once at the bottom.

### 4.1 Auth

```
POST /api/v1/admin/login                                   public
  body: { username: string; password: string }
  200:  { success: true, message: "Login successful",
          data: { _id, username, name, role, permissions },
          token: string, tokenExpiredIn: number }

GET  /api/v1/admin/me                                      admin
  200:  { success: true, data: AdminPublic }

POST /api/v1/admin/change-password                         admin
  body: { currentPassword: string; newPassword: string }
  200:  { success: true, message: "Password changed" }
```

### 4.2 Admin (super-admin only)

```
POST   /api/v1/admin                       roles: SUPER_ADMIN
  body: CreateAdminDto                     -> { success: true, data: { _id } }

POST   /api/v1/admin/get-all               roles: SUPER_ADMIN
  body: FilterAndPagination
  200:  { success: true, data: AdminPublic[], count: number }

GET    /api/v1/admin/:id                   roles: SUPER_ADMIN
PUT    /api/v1/admin/:id                   roles: SUPER_ADMIN
  body: UpdateAdminDto
DELETE /api/v1/admin/:id                   roles: SUPER_ADMIN
```

### 4.3 Projects

```
POST   /api/v1/projects/get-all            public
  body: FilterAndPagination
  200:  { success: true, data: Project[], count: number }
        -- public clients always implicitly filter status="published"

GET    /api/v1/projects/by-slug/:slug      public
  200:  { success: true, data: Project }

GET    /api/v1/projects/featured           public
  200:  { success: true, data: Project[] }
        -- returns published + featured, sorted by order asc

POST   /api/v1/projects                    admin permissions: CREATE
  body: CreateProjectDto
  201:  { success: true, data: { _id }, message: "Project created" }

GET    /api/v1/projects/admin/:id          admin permissions: GET
  200:  { success: true, data: Project }   -- includes draft + archived

POST   /api/v1/projects/admin/get-all      admin permissions: GET
  body: FilterAndPagination

PUT    /api/v1/projects/:id                admin permissions: EDIT
  body: UpdateProjectDto

DELETE /api/v1/projects/:id                admin permissions: DELETE
POST   /api/v1/projects/reorder            admin permissions: EDIT
  body: { ids: string[] }                   -- new order
```

### 4.4 Skills

Identical CRUD shape to Projects, scoped to skills. No `slug`, no `featured`, no `status`. Public list returns `visible: true` only.

```
POST   /api/v1/skills/get-all              public
GET    /api/v1/skills/grouped              public        -- returns Record<category, Skill[]>
POST   /api/v1/skills                      admin CREATE
PUT    /api/v1/skills/:id                  admin EDIT
DELETE /api/v1/skills/:id                  admin DELETE
POST   /api/v1/skills/reorder              admin EDIT
```

### 4.5 Experience

Identical CRUD shape; no slug; sorted by `startDate` descending by default.

```
POST   /api/v1/experience/get-all          public
POST   /api/v1/experience                  admin CREATE
PUT    /api/v1/experience/:id              admin EDIT
DELETE /api/v1/experience/:id              admin DELETE
POST   /api/v1/experience/reorder          admin EDIT
```

### 4.6 Themes

```
GET    /api/v1/themes/active               public
  200:  { success: true, data: Theme }     -- the currently-active theme tokens

GET    /api/v1/themes                      public
  200:  { success: true, data: Theme[] }   -- all visible themes (catalog for the picker)

GET    /api/v1/themes/by-id/:themeId       public
  200:  { success: true, data: Theme }

POST   /api/v1/themes                      admin CREATE   -- creates a custom theme
  body: CreateThemeDto                                    -- validated against JSON schema
PUT    /api/v1/themes/:id                  admin EDIT
DELETE /api/v1/themes/:id                  admin DELETE   -- only non-built-in
POST   /api/v1/themes/activate/:themeId    admin EDIT     -- writes Settings.activeThemeId
POST   /api/v1/themes/import               admin CREATE   -- multipart, accepts a .json
```

### 4.7 Settings

```
GET    /api/v1/settings                    public
  200:  { success: true, data: Settings }  -- public-safe subset (omits internal fields)

PUT    /api/v1/settings                    admin EDIT
  body: UpdateSettingsDto                  -- partial; full settings document accepted
```

### 4.8 Media

```
POST   /api/v1/media/upload                admin CREATE
  multipart/form-data: { file: File, folder?: string }
  201:  { success: true, data: { url: string, filename: string, size: number, mimeType: string } }
```

In dev, files land in `apps/api/uploads/` and are served statically at `/uploads/*`. In prod, the same endpoint can be wired to S3-compatible storage with one config change.

### 4.9 Contact

```
POST   /api/v1/contact                     public, rate-limited (5/hour/IP)
  body: { name: string; email: string; subject: string; message: string; honeypot?: '' }
  200:  { success: true, message: "Thanks — I'll be in touch." }
```

The handler stores the message in a `ContactMessage` collection (admin-readable) and optionally fires off an email via Nodemailer when SMTP env vars are present. The honeypot field is required to be empty; non-empty rejects silently with a 200 to fool bots.

## 5. DTOs (representative)

`CreateProjectDto`, the most representative DTO:

```ts
import { IsString, IsArray, IsBoolean, IsOptional, IsIn, IsInt, Min,
         MaxLength, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProjectLinkDto {
  @IsString() label: string;
  @IsString() url:   string;
}

export class CreateProjectDto {
  @IsString() @MaxLength(120) title: string;
  @IsString() @MaxLength(120) slug:  string;
  @IsString() @MaxLength(280) summary: string;
  @IsString() description: string;

  @IsString() coverImage: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(20)
  gallery?: string[];

  @IsArray() @IsString({ each: true }) @ArrayMaxSize(10) tags: string[];

  @IsArray() @IsString({ each: true }) @ArrayMaxSize(20) techStack: string[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ProjectLinkDto)
  links?: ProjectLinkDto[];

  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() @Min(0) order?: number;

  @IsIn(['draft', 'published', 'archived']) status: 'draft' | 'published' | 'archived';
}
```

`FilterAndPaginationProjectDto` and `UpdateProjectDto` follow rone-api's patterns: nested filter DTO, partial update via either an explicit DTO or `PartialType(CreateProjectDto)` (we'll use the latter — more compact than rone-api's explicit Update DTOs, but functionally equivalent).

## 6. Error envelope

Common error responses, all wrapped in `ResponsePayload`:

```
400 Bad Request          -> success:false, message:"Validation failed", data:{ errors: [...] }
401 Unauthorized         -> success:false, message:"Invalid or missing token"
403 Forbidden            -> success:false, message:"Insufficient role/permission"
404 Not Found            -> success:false, message:"Project not found"
409 Conflict             -> success:false, message:"Slug already in use", errorCode:"UNIQUE_FIELD"
429 Too Many Requests    -> success:false, message:"Rate limit exceeded"
500 Internal Server Error-> success:false, message:"Internal server error"
```

The `AllExceptionsFilter` handles all of these. `class-validator` failures get the `400` shape with the per-field errors array.

## 7. Indexes

Mongoose indexes worth declaring up front so we don't bolt them on later:

`Project`: `{ slug: 1 }` unique, `{ status: 1, featured: 1, order: 1 }` compound for the home page query, `{ tags: 1 }` for tag filtering.

`Skill`: `{ name: 1 }` unique, `{ category: 1, order: 1 }` compound.

`Experience`: `{ startDate: -1 }`.

`Theme`: `{ themeId: 1 }` unique.

`Admin`: `{ username: 1 }` unique.

## 8. Seed data

A script `apps/api/scripts/seed.ts` runs on first boot in dev. It creates: one super-admin (username from env, password from env), the two built-in themes (`minimal-light` and `editorial-serif` from THEME_SCHEMA.md), and a Settings document with `activeThemeId: "minimal-light"`. Idempotent — running twice doesn't duplicate.

## 9. Open questions to confirm before implementation

A handful of decisions deliberately deferred to you. Whether the public UI needs any user-side auth at all — most portfolios don't, in which case we drop the `Authorization: Bearer` user strategy entirely and only ship the admin one. Whether the admin should support multi-user (your existing `rone-api` does, with super-admin + editor roles) or single-admin (simpler, recommended for a personal portfolio). Whether the contact form should send emails directly or just store messages (storage is simpler and more reliable; email can be added later via a queue). Whether you want a `BlogPost` resource — out of scope today, easy to add later given this layout.
