/**
 * Shared TypeScript types used by the API, the public UI, and the admin app.
 *
 * Keep this file pure: NO runtime code, NO framework imports, NO Mongoose
 * imports. Only types. Anything else breaks the no-cost dependency graph.
 */

// ---------------------------------------------------------------------------
// Generic envelope returned by every API response
// ---------------------------------------------------------------------------

export interface ResponsePayload<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  errorCode?: string;
}

// ---------------------------------------------------------------------------
// Filter & pagination (matches FilterAndPagination shape across the codebase)
// ---------------------------------------------------------------------------

export interface Pagination {
  pageNumber: number;
  pageSize: number;
}

export interface FilterAndPagination<TFilter = Record<string, unknown>> {
  filter?: TFilter;
  pagination?: Pagination;
  sort?: Record<string, 1 | -1>;
  select?: string | Record<string, 0 | 1>;
}

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  techStack: string[];
  links: ProjectLink[];
  featured: boolean;
  order: number;
  status: ProjectStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  icon: string | null;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  _id: string;
  role: string;
  company: string;
  companyLogo: string | null;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  bullets: string[];
  techStack: string[];
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Theme types — see docs/THEME_SCHEMA.md for the full canonical spec.
// These mirror that doc 1:1.
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';

export interface ColorTokens {
  bg: string;
  bgElevated: string;
  bgSubtle: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryFg: string;
  accent: string;
  accentFg: string;
  success: string;
  warning: string;
  danger: string;
}

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface TypographyTokens {
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  scale: TypographyScale;
  weight: { regular: number; medium: number; semibold: number; bold: number };
  lineHeight: { tight: number; normal: number; relaxed: number };
  letterSpacing: { tight: string; normal: string; wide: string };
}

export interface SpaceTokens {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  '6': string;
  '8': string;
  '10': string;
  '12': string;
  '16': string;
}

export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
}

export interface MotionTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easeStandard: string;
  easeIn: string;
  easeOut: string;
  reduceMotion: boolean;
}

export interface LayoutTokens {
  containerMaxWidth: string;
  contentMaxWidth: string;
  sidebarWidth: string;
  navHeight: string;
  density: 'comfortable' | 'compact';
}

export interface ThemeTokens {
  color: ColorTokens;
  typography: TypographyTokens;
  space: SpaceTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  motion: MotionTokens;
  layout: LayoutTokens;
}

export interface ComponentOverrides {
  fontStylesheets?: string[];
  card?: { borderStyle?: 'none' | 'solid'; elevation?: 'flat' | 'raised' };
  button?: { style?: 'solid' | 'outline' | 'ghost'; casing?: 'normal' | 'uppercase' };
  hero?: { layout?: 'centered' | 'split' | 'asymmetric' };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  mode: ThemeMode;
  tokens: ThemeTokens;
  components?: ComponentOverrides;
}

// ---------------------------------------------------------------------------
// Settings (singleton document)
// ---------------------------------------------------------------------------

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  other?: { label: string; url: string }[];
}

export interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface Settings {
  _id: string;
  siteTitle: string;
  siteTagline: string;
  ownerName: string;
  ownerHeadline: string;
  ownerBio: string;
  ownerAvatar: string;
  resumeUrl: string | null;
  contactEmail: string;
  social: SocialLinks;
  activeThemeId: string;
  seo: SeoMeta;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Admin (single-admin model — no roles/permissions)
// ---------------------------------------------------------------------------

export interface AdminPublic {
  _id: string;
  username: string;
  name: string;
  lastLoggedIn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: AdminPublic;
  token: string;
  tokenExpiredIn: number;
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}
