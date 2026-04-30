# Theme Schema

This document defines the JSON shape of a theme. A theme is a static asset (lives in `libs/themes/<id>.json`) plus an entry in the database `Theme` collection so the admin can list, activate, and (optionally) override it without redeploying.

The schema is designed around three principles. First, it must be **flat enough to render as CSS custom properties** — every leaf value becomes `--<group>-<token>` on `:root`. Second, it must be **strict enough to validate** so a broken theme can never reach production. Third, it must be **shallow enough to author by hand** in five minutes; deep nested structures kill the iteration speed that makes themeable portfolios fun.

## 1. Top-level shape

```ts
interface Theme {
  id:          string;            // kebab-case, unique, stable. e.g. "minimal-light"
  name:        string;            // display name. e.g. "Minimal Light"
  description: string;            // one-line vibe. shown in the picker.
  preview:     string;            // path or URL to a preview image (optional but recommended)
  mode:        'light' | 'dark';  // hint for the OS color-scheme meta + Material theme
  tokens: {
    color:       ColorTokens;
    typography:  TypographyTokens;
    space:       SpaceTokens;
    radius:      RadiusTokens;
    shadow:      ShadowTokens;
    motion:      MotionTokens;
    layout:      LayoutTokens;
  };
  components?: ComponentOverrides;  // optional, advanced
}
```

A few notes on the field choices. `id` is what gets persisted to localStorage and the database; once published, never change it. `mode` is a hint that drives the `<meta name="color-scheme">` tag and which Material palette base to derive from — it doesn't constrain the color tokens themselves, you can have a "dark mode with warm beige accents" theme and that's fine. `preview` is rendered in the admin theme picker and on a public `/themes` showcase page if you want one.

## 2. Token groups

### Color

```ts
interface ColorTokens {
  bg:         string;  // page background
  bgElevated: string;  // cards, modals, sticky headers
  bgSubtle:   string;  // input backgrounds, hover states
  fg:         string;  // primary text
  fgMuted:    string;  // secondary text, captions
  fgSubtle:   string;  // disabled text, hints
  border:     string;  // dividers, input borders
  borderStrong: string;
  primary:    string;  // brand / CTA
  primaryFg:  string;  // text on primary backgrounds
  accent:     string;  // links, highlights, secondary CTA
  accentFg:   string;
  success:    string;
  warning:    string;
  danger:     string;
}
```

All values are CSS color strings — `#hex`, `rgb()`, `hsl()`, `oklch()`, whatever. The renderer doesn't care. Validation just checks "is this a valid CSS color".

### Typography

```ts
interface TypographyTokens {
  fontDisplay: string;   // headings, hero
  fontBody:    string;   // body text, UI
  fontMono:    string;   // code blocks, technical specs
  scale: {
    xs:   string;        // e.g. "0.75rem"
    sm:   string;
    base: string;
    md:   string;
    lg:   string;
    xl:   string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  weight: {
    regular: number;     // 400
    medium:  number;     // 500
    semibold: number;    // 600
    bold:    number;     // 700
  };
  lineHeight: {
    tight:  number;      // 1.1
    normal: number;      // 1.5
    relaxed: number;     // 1.75
  };
  letterSpacing: {
    tight:  string;      // "-0.02em"
    normal: string;      // "0"
    wide:   string;      // "0.05em"
  };
}
```

Font values are full CSS font-family stacks ("Inter, ui-sans-serif, system-ui, sans-serif"). The theme is responsible for being self-sufficient — if a theme uses a custom font, its JSON includes a `fontStylesheets: string[]` URL array (added in components below) that the engine appends to `<head>`.

### Space, radius, shadow

```ts
interface SpaceTokens {
  '0':  string;  // "0"
  '1':  string;  // "0.25rem"
  '2':  string;  // "0.5rem"
  '3':  string;  // "0.75rem"
  '4':  string;  // "1rem"
  '5':  string;  // "1.5rem"
  '6':  string;  // "2rem"
  '8':  string;  // "3rem"
  '10': string;  // "4rem"
  '12': string;  // "6rem"
  '16': string;  // "8rem"
}

interface RadiusTokens {
  none: string;  // "0"
  sm:   string;  // "0.25rem"
  md:   string;  // "0.5rem"
  lg:   string;  // "1rem"
  xl:   string;  // "1.5rem"
  full: string;  // "9999px"
}

interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
}
```

### Motion

```ts
interface MotionTokens {
  durationFast:    string;    // "150ms"
  durationNormal:  string;    // "250ms"
  durationSlow:    string;    // "500ms"
  easeStandard:    string;    // "cubic-bezier(0.4, 0, 0.2, 1)"
  easeIn:          string;
  easeOut:         string;
  reduceMotion:    boolean;   // if true, all durations collapse to 0ms via media query fallback
}
```

### Layout

```ts
interface LayoutTokens {
  containerMaxWidth: string;  // "1200px"
  contentMaxWidth:   string;  // "720px" — for prose
  sidebarWidth:      string;  // "280px" — admin only
  navHeight:         string;  // "72px"
  density:           'comfortable' | 'compact';  // affects default padding
}
```

### Component overrides (optional, advanced)

```ts
interface ComponentOverrides {
  fontStylesheets?: string[];  // <link rel="stylesheet"> URLs appended on apply
  card?: {
    borderStyle?: 'none' | 'solid';
    elevation?:   'flat' | 'raised';
  };
  button?: {
    style?: 'solid' | 'outline' | 'ghost';
    casing?: 'normal' | 'uppercase';
  };
  hero?: {
    layout?: 'centered' | 'split' | 'asymmetric';
  };
}
```

Component overrides are *flags*, not arbitrary CSS. They map to predefined Angular component variants. This keeps themes safe — you can't accidentally inject CSS that breaks the layout — at the cost of less freedom. For a portfolio that's the right trade.

## 3. How tokens become CSS variables

Flatten the nested object with a dash-separated path; lowercase the camelCase. So `tokens.color.bg` becomes `--color-bg`, `tokens.typography.scale['2xl']` becomes `--typography-scale-2xl`, `tokens.motion.durationNormal` becomes `--motion-duration-normal`. The `theme-engine` library is the source of truth for this mapping; one helper function, one test suite.

SCSS in the apps then uses `var(--color-bg)`, `var(--space-4)`, etc. Material's compile-time SCSS keeps its own variables for the Material internals, but every *portfolio*-owned style references CSS custom properties so themes swap at runtime.

## 4. Validation

A `joi` schema in `apps/api/src/validation/theme.schema.ts` is the single source of truth at the API boundary. It enforces: `id` is kebab-case `[a-z0-9-]+`, `mode` is `light|dark`, every color is a valid CSS color, every space/radius/font-size string matches a CSS length regex, scale and space groups have all required keys, no unknown top-level keys (`stripUnknown: false, abortEarly: false`).

The Angular admin theme editor uses the same JSON schema (exported as JSON Schema for tooling) so the form mirrors the API exactly.

## 5. Example theme — Minimal Light

```json
{
  "id": "minimal-light",
  "name": "Minimal Light",
  "description": "Clean, airy, system-font, lots of negative space.",
  "preview": "/themes/minimal-light.png",
  "mode": "light",
  "tokens": {
    "color": {
      "bg":           "#ffffff",
      "bgElevated":   "#ffffff",
      "bgSubtle":     "#f5f5f4",
      "fg":           "#1c1917",
      "fgMuted":      "#57534e",
      "fgSubtle":     "#a8a29e",
      "border":       "#e7e5e4",
      "borderStrong": "#d6d3d1",
      "primary":      "#0f172a",
      "primaryFg":    "#ffffff",
      "accent":       "#0ea5e9",
      "accentFg":     "#ffffff",
      "success":      "#10b981",
      "warning":      "#f59e0b",
      "danger":       "#ef4444"
    },
    "typography": {
      "fontDisplay": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      "fontBody":    "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      "fontMono":    "ui-monospace, SFMono-Regular, Menlo, monospace",
      "scale": {
        "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "md": "1.125rem",
        "lg": "1.25rem", "xl": "1.5rem", "2xl": "2rem", "3xl": "2.5rem", "4xl": "3.5rem"
      },
      "weight":        { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 },
      "lineHeight":    { "tight": 1.15, "normal": 1.55, "relaxed": 1.75 },
      "letterSpacing": { "tight": "-0.015em", "normal": "0", "wide": "0.04em" }
    },
    "space": {
      "0":"0","1":"0.25rem","2":"0.5rem","3":"0.75rem","4":"1rem","5":"1.5rem",
      "6":"2rem","8":"3rem","10":"4rem","12":"6rem","16":"8rem"
    },
    "radius": { "none":"0","sm":"0.25rem","md":"0.5rem","lg":"1rem","xl":"1.5rem","full":"9999px" },
    "shadow": {
      "sm":"0 1px 2px rgba(15,23,42,0.06)",
      "md":"0 4px 12px rgba(15,23,42,0.08)",
      "lg":"0 12px 32px rgba(15,23,42,0.10)",
      "xl":"0 24px 64px rgba(15,23,42,0.14)",
      "inner":"inset 0 1px 2px rgba(15,23,42,0.05)"
    },
    "motion": {
      "durationFast":"150ms","durationNormal":"250ms","durationSlow":"450ms",
      "easeStandard":"cubic-bezier(0.4, 0, 0.2, 1)",
      "easeIn":"cubic-bezier(0.4, 0, 1, 1)",
      "easeOut":"cubic-bezier(0, 0, 0.2, 1)",
      "reduceMotion": false
    },
    "layout": {
      "containerMaxWidth":"1200px","contentMaxWidth":"680px",
      "sidebarWidth":"280px","navHeight":"72px","density":"comfortable"
    }
  },
  "components": {
    "card":   { "borderStyle":"solid", "elevation":"flat" },
    "button": { "style":"solid", "casing":"normal" },
    "hero":   { "layout":"centered" }
  }
}
```

## 6. Example theme — Editorial Serif

```json
{
  "id": "editorial-serif",
  "name": "Editorial Serif",
  "description": "Magazine layout, serif headers, warm cream background, asymmetric hero.",
  "preview": "/themes/editorial-serif.png",
  "mode": "light",
  "tokens": {
    "color": {
      "bg":           "#faf6ee",
      "bgElevated":   "#ffffff",
      "bgSubtle":     "#f3ecdf",
      "fg":           "#2a2118",
      "fgMuted":      "#6b5f50",
      "fgSubtle":     "#a99c89",
      "border":       "#e2d8c5",
      "borderStrong": "#c9bca3",
      "primary":      "#7a2e1f",
      "primaryFg":    "#faf6ee",
      "accent":       "#a85a32",
      "accentFg":     "#faf6ee",
      "success":      "#3f6e3f",
      "warning":      "#a8780f",
      "danger":       "#9b2226"
    },
    "typography": {
      "fontDisplay": "'Fraunces', 'Playfair Display', Georgia, serif",
      "fontBody":    "'Source Serif 4', 'Source Serif Pro', Georgia, serif",
      "fontMono":    "'JetBrains Mono', ui-monospace, monospace",
      "scale": {
        "xs":"0.8125rem","sm":"0.9375rem","base":"1.0625rem","md":"1.1875rem",
        "lg":"1.375rem","xl":"1.75rem","2xl":"2.25rem","3xl":"3rem","4xl":"4.25rem"
      },
      "weight":        { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 },
      "lineHeight":    { "tight": 1.1, "normal": 1.65, "relaxed": 1.85 },
      "letterSpacing": { "tight":"-0.025em","normal":"0","wide":"0.06em" }
    },
    "space": {
      "0":"0","1":"0.25rem","2":"0.5rem","3":"0.75rem","4":"1rem","5":"1.75rem",
      "6":"2.5rem","8":"4rem","10":"5.5rem","12":"8rem","16":"12rem"
    },
    "radius": { "none":"0","sm":"0.125rem","md":"0.25rem","lg":"0.5rem","xl":"1rem","full":"9999px" },
    "shadow": {
      "sm":"0 1px 0 rgba(42,33,24,0.08)",
      "md":"0 6px 18px rgba(42,33,24,0.10)",
      "lg":"0 16px 40px rgba(42,33,24,0.14)",
      "xl":"0 28px 80px rgba(42,33,24,0.18)",
      "inner":"inset 0 1px 2px rgba(42,33,24,0.06)"
    },
    "motion": {
      "durationFast":"180ms","durationNormal":"320ms","durationSlow":"600ms",
      "easeStandard":"cubic-bezier(0.22, 1, 0.36, 1)",
      "easeIn":"cubic-bezier(0.55, 0, 1, 0.45)",
      "easeOut":"cubic-bezier(0, 0.55, 0.45, 1)",
      "reduceMotion": false
    },
    "layout": {
      "containerMaxWidth":"1280px","contentMaxWidth":"680px",
      "sidebarWidth":"300px","navHeight":"80px","density":"comfortable"
    }
  },
  "components": {
    "fontStylesheets": [
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&display=swap"
    ],
    "card":   { "borderStyle":"none", "elevation":"raised" },
    "button": { "style":"outline",   "casing":"uppercase" },
    "hero":   { "layout":"asymmetric" }
  }
}
```

## 7. Adding a new theme — the workflow

Once the theme engine and the schema are in place, adding a theme is three steps. Drop a `<id>.json` in `libs/themes/` (or use the admin theme editor, which writes the same JSON to the database). Run `npm run validate-themes` (calls the `joi` schema against every JSON in the folder, fails CI if any is invalid). Add an entry to the seed script so a fresh database has it preloaded. The new theme then appears in the admin picker and the public theme switcher automatically — no code changes.

## 8. Theme switching — runtime semantics

On bootstrap, the public UI fetches the active theme from `GET /api/v1/themes/active`. If the user has previously chosen one (`localStorage.portfolio.theme`), that overrides the active server theme. The chosen theme JSON is applied via `theme-engine.applyTheme()`, which sets ~80 CSS custom properties on `:root` and (if present) appends the `fontStylesheets` to `<head>`. The whole switch happens in well under one frame; no flash, no layout reflow if you size your prose with the new tokens consistently.

The admin's theme picker uses the same engine, but it scopes the application to a `<div data-preview-theme>` so the admin chrome stays in its own theme while the editor previews the public site's theme on the right.
