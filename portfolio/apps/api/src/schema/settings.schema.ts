import * as mongoose from 'mongoose';

export interface Settings extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  siteTitle: string;
  siteTagline: string;
  ownerName: string;
  ownerHeadline: string;
  ownerBio: string;
  ownerAvatar: string;
  resumeUrl: string | null;
  contactEmail: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    other?: { label: string; url: string }[];
  };
  activeThemeId: string;
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
  createdAt: Date;
  updatedAt: Date;
}

export const SettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'My Portfolio' },
    siteTagline: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    ownerHeadline: { type: String, default: '' },
    ownerBio: { type: String, default: '' },
    ownerAvatar: { type: String, default: '' },
    resumeUrl: { type: String, default: null },
    contactEmail: { type: String, default: '' },
    social: { type: mongoose.Schema.Types.Mixed, default: {} },
    activeThemeId: { type: String, required: true, default: 'minimal-light' },
    seo: { type: mongoose.Schema.Types.Mixed, default: { metaTitle: '', metaDescription: '', ogImage: '' } },
  },
  { timestamps: true, versionKey: false },
);
