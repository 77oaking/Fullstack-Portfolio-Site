#!/usr/bin/env node
/**
 * Lightweight validator for libs/themes/*.json.
 *
 * Run with: `npm run validate-themes`
 * Fails (exit 1) on any structural error so it can gate CI.
 *
 * For a strict, joi-backed validator with friendly error messages, see
 * apps/api — once running, POST a theme to /api/v1/themes and the joi
 * pipeline produces detailed errors.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themesDir = path.resolve(__dirname, '..', 'libs', 'themes');

const required = {
  top: ['id', 'name', 'description', 'preview', 'mode', 'tokens'],
  tokens: ['color', 'typography', 'space', 'radius', 'shadow', 'motion', 'layout'],
  color: [
    'bg', 'bgElevated', 'bgSubtle', 'fg', 'fgMuted', 'fgSubtle',
    'border', 'borderStrong', 'primary', 'primaryFg', 'accent', 'accentFg',
    'success', 'warning', 'danger',
  ],
  scale: ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
  space: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'],
  radius: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
  shadow: ['sm', 'md', 'lg', 'xl', 'inner'],
};

const errors = [];
function err(file, msg) {
  errors.push(`  ${file}: ${msg}`);
}

const files = fs.readdirSync(themesDir).filter((f) => f.endsWith('.json'));
if (!files.length) {
  console.error(`No theme files in ${themesDir}`);
  process.exit(1);
}

for (const file of files) {
  let json;
  try {
    json = JSON.parse(fs.readFileSync(path.join(themesDir, file), 'utf-8'));
  } catch (e) {
    err(file, `invalid JSON: ${e.message}`);
    continue;
  }

  for (const k of required.top) if (!(k in json)) err(file, `missing top-level key '${k}'`);
  if (!/^[a-z0-9-]+$/.test(json.id ?? '')) err(file, `id must be kebab-case`);
  if (!['light', 'dark'].includes(json.mode)) err(file, `mode must be 'light' or 'dark'`);

  if (json.tokens && typeof json.tokens === 'object') {
    for (const k of required.tokens) {
      if (!(k in json.tokens)) err(file, `missing tokens.${k}`);
    }
    if (json.tokens.color) {
      for (const k of required.color) {
        if (!(k in json.tokens.color)) err(file, `missing tokens.color.${k}`);
      }
    }
    if (json.tokens.typography?.scale) {
      for (const k of required.scale) {
        if (!(k in json.tokens.typography.scale))
          err(file, `missing tokens.typography.scale.${k}`);
      }
    }
    if (json.tokens.space) {
      for (const k of required.space) {
        if (!(k in json.tokens.space)) err(file, `missing tokens.space.${k}`);
      }
    }
    if (json.tokens.radius) {
      for (const k of required.radius) {
        if (!(k in json.tokens.radius)) err(file, `missing tokens.radius.${k}`);
      }
    }
    if (json.tokens.shadow) {
      for (const k of required.shadow) {
        if (!(k in json.tokens.shadow)) err(file, `missing tokens.shadow.${k}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`\nTheme validation FAILED (${errors.length} error${errors.length === 1 ? '' : 's'}):\n`);
  for (const e of errors) console.error(e);
  console.error('');
  process.exit(1);
}

console.log(`Validated ${files.length} theme${files.length === 1 ? '' : 's'} — all good.`);
