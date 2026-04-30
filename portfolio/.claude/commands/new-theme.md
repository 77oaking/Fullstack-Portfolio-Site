Start a new theme JSON.

Theme: $ARGUMENTS

Steps:

1. Copy `libs/themes/minimal-light.json` to `libs/themes/<id>.json` where `<id>` is a kebab-case version of the theme name.
2. Set `id`, `name`, `description`, `mode` ('light' or 'dark'), and `preview` (path placeholder).
3. Update the color tokens, typography, spacing, radii, shadows, motion, and layout to match the requested vibe.
4. If the theme uses non-system fonts, set `components.fontStylesheets` to the Google Fonts (or other) URL(s).
5. Run `npm run validate-themes` and fix any errors.
6. Add a one-line entry to the README list of built-in themes.
7. (Optional) Add the theme to `apps/api/scripts/seed.ts` so fresh DBs get it.

Show the generated theme as a tiny HTML preview so the user can eyeball the colors before committing.
