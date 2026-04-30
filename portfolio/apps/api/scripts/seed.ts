/**
 * Seed script — idempotent.
 *
 * Run with: `npm run seed` (from repo root or apps/api).
 *
 * Creates:
 *  - one admin user (from .env credentials, password bcrypt-hashed)
 *  - the two built-in themes (minimal-light, editorial-serif)
 *  - one Settings document with activeThemeId="minimal-light"
 *
 * Running it twice does not duplicate; it updates in-place where appropriate.
 */
import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { AdminSchema } from '../src/schema/admin.schema';
import { ThemeSchema } from '../src/schema/theme.schema';
import { SettingsSchema } from '../src/schema/settings.schema';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? 'admin').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'change-me-immediately';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Site Owner';

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Copy .env.example to .env first.');
  process.exit(1);
}

async function main(): Promise<void> {
  await mongoose.connect(MONGO_URI as string);
  console.log('Connected to MongoDB.');

  const Admin = mongoose.model('Admin', AdminSchema);
  const Theme = mongoose.model('Theme', ThemeSchema);
  const Settings = mongoose.model('Settings', SettingsSchema);

  // ---- Admin --------------------------------------------------------
  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log(`Admin '${ADMIN_USERNAME}' already exists (skipped).`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({
      username: ADMIN_USERNAME,
      password: hash,
      name: ADMIN_NAME,
      hasAccess: true,
    });
    console.log(`Created admin '${ADMIN_USERNAME}'.`);
  }

  // ---- Themes --------------------------------------------------------
  const themesDir = path.resolve(__dirname, '..', '..', '..', 'libs', 'themes');
  const files = fs.readdirSync(themesDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(themesDir, file), 'utf-8'));
    await Theme.updateOne(
      { themeId: json.id },
      {
        $set: {
          themeId: json.id,
          name: json.name,
          description: json.description,
          preview: json.preview,
          mode: json.mode,
          tokens: json.tokens,
          components: json.components ?? null,
          isBuiltIn: true,
          visible: true,
        },
      },
      { upsert: true },
    );
    console.log(`Upserted theme '${json.id}'.`);
  }

  // ---- Settings -----------------------------------------------------
  const settings = await Settings.findOne();
  if (settings) {
    console.log('Settings document already exists (skipped).');
  } else {
    await Settings.create({
      siteTitle: 'My Portfolio',
      siteTagline: 'Things I build.',
      ownerName: ADMIN_NAME,
      ownerHeadline: 'Full-stack engineer',
      ownerBio: 'Edit me from the admin app.',
      ownerAvatar: '',
      contactEmail: '',
      activeThemeId: 'minimal-light',
      seo: {
        metaTitle: 'My Portfolio',
        metaDescription: 'Selected work.',
        ogImage: '',
      },
    });
    console.log('Created default Settings document.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
