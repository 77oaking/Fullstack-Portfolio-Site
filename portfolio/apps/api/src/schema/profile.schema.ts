import * as mongoose from 'mongoose';

export interface ProfileDoc extends mongoose.Document {
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
  socials: { platform: string; label: string; url: string; icon?: string }[];
  highlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
  },
  { _id: false },
);

export const ProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    bio: { type: String, default: '' },
    shortBio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    coverUrl: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    location: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0, max: 80 },
    availableForWork: { type: Boolean, default: true },
    socials: { type: [SocialSchema], default: [] },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false, collection: 'profiles' },
);
