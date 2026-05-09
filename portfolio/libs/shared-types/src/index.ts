/**
 * Shared portfolio data model — single source of truth.
 *
 * Every API response, every admin form, and every UI theme reads/writes
 * these shapes. Adding a new field here is the trigger to update the matching
 * Mongoose schema, DTO, admin form, and UI section.
 *
 * Keep this file pure: NO runtime code, NO framework imports, NO Mongoose.
 */

export type ID = string;

/* ------------------------------------------------------------------ */
/* Common                                                              */
/* ------------------------------------------------------------------ */

export interface ResponsePayload<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  errorCode?: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  icon?: string;
}

/* ------------------------------------------------------------------ */
/* Profile (singleton)                                                 */
/* ------------------------------------------------------------------ */

export interface Profile {
  _id?: ID;
  fullName: string;
  shortName: string;
  title: string;
  tagline: string;
  bio: string;
  shortBio: string;
  avatarUrl: string;
  coverUrl?: string;
  resumeUrl?: string;
  location: string;
  email: string;
  phone?: string;
  yearsOfExperience?: number;
  availableForWork: boolean;
  socials: SocialLink[];
  highlights: string[];
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Hero (singleton)                                                    */
/* ------------------------------------------------------------------ */

export interface HeroMetric {
  value: string;
  label: string;
}

export interface HeroSection {
  _id?: ID;
  badge?: string;
  headline: string;
  subhead: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  metrics: HeroMetric[];
  techMarquee: string[];
}

/* ------------------------------------------------------------------ */
/* About (singleton)                                                   */
/* ------------------------------------------------------------------ */

export interface AboutFact {
  label: string;
  value: string;
}

export interface AboutSection {
  _id?: ID;
  heading: string;
  kicker?: string;
  paragraphs: string[];
  imageUrl?: string;
  facts: AboutFact[];
  values: string[];
}

/* ------------------------------------------------------------------ */
/* Experience (collection)                                             */
/* ------------------------------------------------------------------ */

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship';

export interface Experience {
  _id?: ID;
  role: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  location: string;
  type: EmploymentType;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Education (collection)                                              */
/* ------------------------------------------------------------------ */

export interface Education {
  _id?: ID;
  institution: string;
  institutionUrl?: string;
  institutionLogo?: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
  achievements: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Skills (collection of categories)                                   */
/* ------------------------------------------------------------------ */

export interface SkillItem {
  name: string;
  level?: number;
  yearsOfExperience?: number;
  icon?: string;
}

export interface SkillCategory {
  _id?: ID;
  name: string;
  icon?: string;
  description?: string;
  order: number;
  items: SkillItem[];
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Projects (collection)                                               */
/* ------------------------------------------------------------------ */

export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface Project {
  _id?: ID;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  category?: string;
  role?: string;
  team?: string;
  liveUrl?: string;
  repoUrl?: string;
  caseStudyUrl?: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export interface Service {
  _id?: ID;
  title: string;
  description: string;
  icon?: string;
  features: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  _id?: ID;
  name: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  quote: string;
  rating?: number;
  link?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Certifications & Achievements                                       */
/* ------------------------------------------------------------------ */

export interface Certification {
  _id?: ID;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  _id?: ID;
  title: string;
  description: string;
  date?: string;
  icon?: string;
  link?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export interface BlogPost {
  _id?: ID;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: string;
  readingMinutes?: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export interface ContactMessage {
  _id?: ID;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

/* ------------------------------------------------------------------ */
/* Site settings (singleton)                                           */
/* ------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  order: number;
}

export interface FooterConfig {
  copyright: string;
  showSocials: boolean;
  links: NavItem[];
}

export interface SeoConfig {
  defaultTitle: string;
  defaultDescription: string;
  ogImage?: string;
  twitterHandle?: string;
  keywords: string[];
}

export interface SiteFeatures {
  showHero: boolean;
  showAbout: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showServices: boolean;
  showTestimonials: boolean;
  showCertifications: boolean;
  showAchievements: boolean;
  showBlog: boolean;
  showContact: boolean;
}

export interface SiteSettings {
  _id?: ID;
  siteTitle: string;
  siteDescription: string;
  navItems: NavItem[];
  footer: FooterConfig;
  seo: SeoConfig;
  activeTheme: string;
  features: SiteFeatures;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export interface Admin {
  _id?: ID;
  username: string;
  email: string;
  fullName: string;
  lastLoggedIn?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  expiresIn: number;
  admin: Admin;
}

/* ------------------------------------------------------------------ */
/* Aggregated portfolio (returned by GET /api/portfolio)               */
/* ------------------------------------------------------------------ */

export interface PortfolioBundle {
  profile: Profile | null;
  hero: HeroSection | null;
  about: AboutSection | null;
  experiences: Experience[];
  educations: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  certifications: Certification[];
  achievements: Achievement[];
  blogPosts: BlogPost[];
  settings: SiteSettings | null;
}

/* ------------------------------------------------------------------ */
/* Filter & pagination helpers (used by admin list pages)              */
/* ------------------------------------------------------------------ */

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
