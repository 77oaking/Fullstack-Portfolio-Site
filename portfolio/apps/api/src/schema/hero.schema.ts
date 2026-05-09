import * as mongoose from 'mongoose';

export interface HeroDoc extends mongoose.Document {
  badge?: string;
  headline: string;
  subhead: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  metrics: { value: string; label: string }[];
  techMarquee: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MetricSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const HeroSchema = new mongoose.Schema(
  {
    badge: { type: String, trim: true },
    headline: { type: String, required: true, trim: true },
    subhead: { type: String, default: '', trim: true },
    primaryCtaLabel: { type: String, default: 'Get in touch' },
    primaryCtaUrl: { type: String, default: '#contact' },
    secondaryCtaLabel: { type: String, trim: true },
    secondaryCtaUrl: { type: String, trim: true },
    metrics: { type: [MetricSchema], default: [] },
    techMarquee: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false, collection: 'hero' },
);
