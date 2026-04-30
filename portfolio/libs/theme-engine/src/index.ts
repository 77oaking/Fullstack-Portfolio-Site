/**
 * Theme engine — pure TypeScript, framework-agnostic.
 *
 * Responsibilities:
 *  - Flatten a Theme JSON into ~80 CSS custom properties.
 *  - Apply them to a target element (defaults to <html>).
 *  - Persist and read the user's chosen theme id from localStorage.
 *  - Append optional Google-Fonts (or other) stylesheet links to <head>.
 *
 * Used by both apps/ui and apps/admin via tsconfig path alias.
 */

import type { Theme, ThemeTokens } from '@portfolio/shared-types';

const STORAGE_KEY = 'portfolio.theme';
const FONT_LINK_DATA_ATTR = 'data-portfolio-theme-font';

/** Apply a theme. Sets ~80 CSS custom properties on `target` and (optionally)
 *  appends stylesheet <link> elements for custom fonts. */
export function applyTheme(theme: Theme, target?: HTMLElement): void {
  if (typeof document === 'undefined') return; // no-op during SSR
  const root = target ?? document.documentElement;
  const flat = flattenToCssVars(theme.tokens);
  for (const [name, value] of Object.entries(flat)) {
    root.style.setProperty(name, value);
  }
  root.dataset.theme = theme.id;
  root.dataset.themeMode = theme.mode;

  // Update <meta name="color-scheme"> so browser native UIs match.
  setColorScheme(theme.mode);

  // Append/replace font stylesheets if the theme requests them.
  syncFontStylesheets(theme.components?.fontStylesheets ?? []);
}

/** Read the theme id the user chose previously, if any. */
export function loadStoredTheme(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Persist the user's chosen theme id. */
export function rememberTheme(themeId: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // localStorage can throw in private mode, on quota, etc. — best-effort only.
  }
}

/** Forget the user's choice (revert to server default on next bootstrap). */
export function forgetStoredTheme(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Flatten ThemeTokens into a record of { '--<group>-<token>': value }. */
export function flattenToCssVars(tokens: ThemeTokens): Record<string, string> {
  const out: Record<string, string> = {};

  // color
  for (const [k, v] of Object.entries(tokens.color)) {
    out[`--color-${kebab(k)}`] = String(v);
  }

  // typography
  out['--font-display'] = tokens.typography.fontDisplay;
  out['--font-body'] = tokens.typography.fontBody;
  out['--font-mono'] = tokens.typography.fontMono;
  for (const [k, v] of Object.entries(tokens.typography.scale)) {
    out[`--font-size-${k}`] = String(v);
  }
  for (const [k, v] of Object.entries(tokens.typography.weight)) {
    out[`--font-weight-${kebab(k)}`] = String(v);
  }
  for (const [k, v] of Object.entries(tokens.typography.lineHeight)) {
    out[`--line-height-${kebab(k)}`] = String(v);
  }
  for (const [k, v] of Object.entries(tokens.typography.letterSpacing)) {
    out[`--letter-spacing-${kebab(k)}`] = String(v);
  }

  // space
  for (const [k, v] of Object.entries(tokens.space)) {
    out[`--space-${k}`] = String(v);
  }

  // radius
  for (const [k, v] of Object.entries(tokens.radius)) {
    out[`--radius-${k}`] = String(v);
  }

  // shadow
  for (const [k, v] of Object.entries(tokens.shadow)) {
    out[`--shadow-${k}`] = String(v);
  }

  // motion
  out['--motion-duration-fast'] = tokens.motion.durationFast;
  out['--motion-duration-normal'] = tokens.motion.durationNormal;
  out['--motion-duration-slow'] = tokens.motion.durationSlow;
  out['--motion-ease-standard'] = tokens.motion.easeStandard;
  out['--motion-ease-in'] = tokens.motion.easeIn;
  out['--motion-ease-out'] = tokens.motion.easeOut;

  // layout
  out['--layout-container-max'] = tokens.layout.containerMaxWidth;
  out['--layout-content-max'] = tokens.layout.contentMaxWidth;
  out['--layout-sidebar-width'] = tokens.layout.sidebarWidth;
  out['--layout-nav-height'] = tokens.layout.navHeight;
  out['--layout-density'] = tokens.layout.density;

  return out;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function setColorScheme(mode: 'light' | 'dark'): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    document.head.appendChild(meta);
  }
  meta.content = mode;
}

function syncFontStylesheets(urls: string[]): void {
  // Remove old theme-managed font links that aren't in the new list.
  document
    .querySelectorAll<HTMLLinkElement>(`link[${FONT_LINK_DATA_ATTR}]`)
    .forEach((el) => {
      if (!urls.includes(el.href)) el.remove();
    });

  // Add any new ones.
  for (const url of urls) {
    if (document.querySelector(`link[href="${url}"]`)) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute(FONT_LINK_DATA_ATTR, '');
    document.head.appendChild(link);
  }
}
