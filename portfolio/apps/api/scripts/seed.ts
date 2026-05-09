/**
 * Seed script — idempotent.
 *
 * Run with: `npm run seed` (from repo root or apps/api).
 *
 * Creates:
 *  - one admin user (from .env credentials, password bcrypt-hashed)
 *  - one demo Profile / Hero / About / Settings document
 *  - a small set of demo Experience / Education / Skill / Project entries
 *    so you can spin up the UI immediately and see things rendering.
 *
 * Running it twice does not duplicate; it updates in-place where appropriate.
 */
import 'reflect-metadata';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { AdminSchema } from '../src/schema/admin.schema';
import { ProfileSchema } from '../src/schema/profile.schema';
import { HeroSchema } from '../src/schema/hero.schema';
import { AboutSchema } from '../src/schema/about.schema';
import { ExperienceSchema } from '../src/schema/experience.schema';
import { EducationSchema } from '../src/schema/education.schema';
import { SkillCategorySchema } from '../src/schema/skill-category.schema';
import { ProjectSchema } from '../src/schema/project.schema';
import { ServiceSchema } from '../src/schema/service.schema';
import { SettingsSchema } from '../src/schema/settings.schema';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? 'admin').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'change-me-immediately';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Site Owner';

if (!MONGO_URI) {
  // eslint-disable-next-line no-console
  console.error('MONGO_URI is required (set in apps/api/.env).');
  process.exit(1);
}

async function main(): Promise<void> {
  await mongoose.connect(MONGO_URI as string);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');

  const Admin = mongoose.model('Admin', AdminSchema);
  const Profile = mongoose.model('Profile', ProfileSchema);
  const Hero = mongoose.model('Hero', HeroSchema);
  const About = mongoose.model('About', AboutSchema);
  const Experience = mongoose.model('Experience', ExperienceSchema);
  const Education = mongoose.model('Education', EducationSchema);
  const SkillCategory = mongoose.model('SkillCategory', SkillCategorySchema);
  const Project = mongoose.model('Project', ProjectSchema);
  const Service = mongoose.model('Service', ServiceSchema);
  const Settings = mongoose.model('Settings', SettingsSchema);

  // 1. Admin
  const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({
      username: ADMIN_USERNAME,
      password: hash,
      name: ADMIN_NAME,
      hasAccess: true,
    });
    // eslint-disable-next-line no-console
    console.log(`Admin "${ADMIN_USERNAME}" created.`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Admin "${ADMIN_USERNAME}" already present — leaving password alone.`);
  }

  // 2. Profile (singleton)
  await Profile.findOneAndUpdate(
    {},
    {
      fullName: 'Md. Azman Hossain',
      shortName: 'Azman',
      title: 'Full Stack Developer',
      tagline: 'Building products that feel fast, look quiet, and ship on time.',
      bio: 'I design and ship full-stack web products end-to-end — Angular and React on the front, NestJS on the back, MongoDB and Postgres for storage, deployed on the cloud. I care about clarity, performance, and the small interactions that make software feel made-with-care.',
      shortBio: 'Full-stack developer focused on Angular, NestJS and clean systems.',
      avatarUrl: '',
      location: 'Dhaka, Bangladesh',
      email: 'hello@azman.dev',
      phone: '',
      yearsOfExperience: 5,
      availableForWork: true,
      socials: [
        { platform: 'github', label: 'GitHub', url: 'https://github.com/' },
        { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/' },
        { platform: 'twitter', label: 'X / Twitter', url: 'https://twitter.com/' },
      ],
      highlights: [
        'Angular 17 + signals',
        'NestJS + Mongoose',
        'Design systems & theming',
        'Performance & DX',
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // 3. Hero
  await Hero.findOneAndUpdate(
    {},
    {
      badge: 'Available for new work',
      headline: 'I build full-stack products that ship.',
      subhead:
        'Front-end systems, back-end APIs, design tokens — from prototype to production with the boring parts done right.',
      primaryCtaLabel: 'Start a project',
      primaryCtaUrl: '#contact',
      secondaryCtaLabel: 'See my work',
      secondaryCtaUrl: '#projects',
      metrics: [
        { value: '5+', label: 'Years experience' },
        { value: '30+', label: 'Projects shipped' },
        { value: '10', label: 'Happy clients' },
      ],
      techMarquee: ['Angular', 'NestJS', 'TypeScript', 'MongoDB', 'Postgres', 'Docker', 'AWS', 'Figma'],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // 4. About
  await About.findOneAndUpdate(
    {},
    {
      heading: 'About me',
      kicker: 'A short story',
      paragraphs: [
        "I'm a full-stack developer who likes building things that feel obvious in hindsight. Most of my work lives at the seam between front-end clarity and back-end reliability.",
        'When I am not shipping, I am usually reading about systems design, taking too many coffee breaks, or breaking my own personal site to try a new idea.',
      ],
      facts: [
        { label: 'Based in', value: 'Dhaka, Bangladesh' },
        { label: 'Open to', value: 'Remote / contract' },
        { label: 'Languages', value: 'English, Bengali' },
      ],
      values: ['Clarity', 'Craft', 'Curiosity', 'Calm releases'],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // 5. Experience (a couple of demo entries)
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany([
      {
        role: 'Senior Full Stack Engineer',
        company: 'Acme Corp',
        location: 'Remote',
        type: 'full-time',
        startDate: '2023-04',
        current: true,
        description:
          'Lead the front-end of a multi-tenant SaaS dashboard. Maintain shared design tokens, ship Angular features behind release flags.',
        achievements: [
          'Cut TTFB of the dashboard by 38% via SSR + selective hydration',
          'Built the design tokens pipeline used by 4 product teams',
        ],
        techStack: ['Angular', 'NestJS', 'PostgreSQL', 'Redis'],
        order: 0,
      },
      {
        role: 'Full Stack Engineer',
        company: 'Studio Alpha',
        location: 'Dhaka',
        type: 'full-time',
        startDate: '2020-08',
        endDate: '2023-03',
        current: false,
        description:
          'Built and shipped client web apps end-to-end — from kickoff to deployment.',
        achievements: [
          'Delivered 12 client projects on schedule',
          'Introduced typed API contracts shared between Angular and NestJS',
        ],
        techStack: ['Angular', 'NestJS', 'MongoDB', 'AWS'],
        order: 1,
      },
    ]);
  }

  // 6. Education
  if ((await Education.countDocuments()) === 0) {
    await Education.insertMany([
      {
        institution: 'University of Example',
        degree: 'B.Sc. in Computer Science',
        fieldOfStudy: 'Software Engineering',
        location: 'Dhaka, Bangladesh',
        startDate: '2016-01',
        endDate: '2020-06',
        current: false,
        gpa: '3.7 / 4.0',
        description: 'Focus on web systems, distributed systems and HCI.',
        achievements: ["Dean's list, 2 years"],
        order: 0,
      },
    ]);
  }

  // 7. Skills (categories)
  if ((await SkillCategory.countDocuments()) === 0) {
    await SkillCategory.insertMany([
      {
        name: 'Frontend',
        order: 0,
        items: [
          { name: 'Angular', level: 95, yearsOfExperience: 5 },
          { name: 'TypeScript', level: 95 },
          { name: 'SCSS / Tailwind', level: 88 },
          { name: 'Signals / RxJS', level: 90 },
        ],
      },
      {
        name: 'Backend',
        order: 1,
        items: [
          { name: 'NestJS', level: 90 },
          { name: 'Node.js', level: 92 },
          { name: 'MongoDB / Mongoose', level: 88 },
          { name: 'PostgreSQL', level: 80 },
        ],
      },
      {
        name: 'Tooling',
        order: 2,
        items: [
          { name: 'Git', level: 95 },
          { name: 'Docker', level: 78 },
          { name: 'CI/CD', level: 80 },
          { name: 'Figma', level: 70 },
        ],
      },
    ]);
  }

  // 8. Projects
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: 'Themeable Portfolio Platform',
        slug: 'portfolio-platform',
        summary:
          'A monorepo platform for building swappable portfolio themes over a single API.',
        description:
          'Three deployables — public UI, admin UI, NestJS API. Each UI theme lives in its own folder, all read from the same data model.',
        coverImage: '',
        techStack: ['Angular 17', 'NestJS', 'MongoDB', 'Mongoose'],
        category: 'Web App',
        featured: true,
        status: 'in-progress',
        order: 0,
      },
      {
        title: 'Studio Alpha — Client Dashboard',
        slug: 'studio-alpha-dashboard',
        summary: 'Internal client dashboard for project status and invoices.',
        description: 'Full-stack project tracking system with role-based views.',
        coverImage: '',
        techStack: ['Angular', 'NestJS', 'PostgreSQL'],
        category: 'Internal Tool',
        featured: true,
        status: 'completed',
        order: 1,
      },
    ]);
  }

  // 9. Services
  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany([
      {
        title: 'Web App Engineering',
        description:
          'End-to-end Angular + NestJS builds, from blank repo to production deploy.',
        features: ['Architecture', 'Implementation', 'Testing', 'Deployment'],
        order: 0,
      },
      {
        title: 'Design System & Theming',
        description: 'Token-driven design systems that survive a year of feature creep.',
        features: ['Design tokens', 'Component library', 'Documentation'],
        order: 1,
      },
      {
        title: 'Technical Audit',
        description: 'Performance, accessibility and DX audits with concrete fix lists.',
        features: ['Performance', 'Accessibility', 'DX', 'Security basics'],
        order: 2,
      },
    ]);
  }

  // 10. Settings
  await Settings.findOneAndUpdate(
    {},
    {
      siteTitle: 'Md. Azman Hossain — Full Stack Developer',
      siteDescription: 'Personal portfolio of Md. Azman Hossain, full-stack developer.',
      navItems: [
        { label: 'About', href: '#about', order: 0 },
        { label: 'Experience', href: '#experience', order: 1 },
        { label: 'Skills', href: '#skills', order: 2 },
        { label: 'Projects', href: '#projects', order: 3 },
        { label: 'Education', href: '#education', order: 4 },
        { label: 'Contact', href: '#contact', order: 5 },
      ],
      footer: {
        copyright: `© ${new Date().getFullYear()} Md. Azman Hossain. All rights reserved.`,
        showSocials: true,
        links: [],
      },
      seo: {
        defaultTitle: 'Md. Azman Hossain — Full Stack Developer',
        defaultDescription: 'Building full-stack products that ship.',
        keywords: ['Angular', 'NestJS', 'Full Stack', 'TypeScript'],
      },
      activeTheme: 'default',
      features: {
        showHero: true,
        showAbout: true,
        showExperience: true,
        showEducation: true,
        showSkills: true,
        showProjects: true,
        showServices: true,
        showTestimonials: true,
        showCertifications: true,
        showAchievements: true,
        showBlog: false,
        showContact: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // eslint-disable-next-line no-console
  console.log('Seed complete.');
  await mongoose.disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
