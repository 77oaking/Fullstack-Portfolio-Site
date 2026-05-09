import * as mongoose from 'mongoose';

export interface SettingsDoc extends mongoose.Document {
  siteTitle: string;
  siteDescription: string;
  navItems: { label: string; href: string; external?: boolean; order: number }[];
  footer: {
    copyright: string;
    showSocials: boolean;
    links: { label: string; href: string; external?: boolean; order: number }[];
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage?: string;
    twitterHandle?: string;
    keywords: string[];
  };
  activeTheme: string;
  features: {
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
  };
  createdAt: Date;
  updatedAt: Date;
}

const NavItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    external: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

export const SettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'My Portfolio' },
    siteDescription: { type: String, default: '' },
    navItems: { type: [NavItemSchema], default: [] },
    footer: {
      copyright: { type: String, default: '' },
      showSocials: { type: Boolean, default: true },
      links: { type: [NavItemSchema], default: [] },
    },
    seo: {
      defaultTitle: { type: String, default: '' },
      defaultDescription: { type: String, default: '' },
      ogImage: { type: String },
      twitterHandle: { type: String },
      keywords: { type: [String], default: [] },
    },
    activeTheme: { type: String, default: 'default' },
    features: {
      showHero: { type: Boolean, default: true },
      showAbout: { type: Boolean, default: true },
      showExperience: { type: Boolean, default: true },
      showEducation: { type: Boolean, default: true },
      showSkills: { type: Boolean, default: true },
      showProjects: { type: Boolean, default: true },
      showServices: { type: Boolean, default: true },
      showTestimonials: { type: Boolean, default: true },
      showCertifications: { type: Boolean, default: true },
      showAchievements: { type: Boolean, default: true },
      showBlog: { type: Boolean, default: false },
      showContact: { type: Boolean, default: true },
    },
  },
  { timestamps: true, versionKey: false, collection: 'settings' },
);
