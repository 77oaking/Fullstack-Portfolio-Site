import * as mongoose from 'mongoose';

export interface AboutDoc extends mongoose.Document {
  heading: string;
  kicker?: string;
  paragraphs: string[];
  imageUrl?: string;
  facts: { label: string; value: string }[];
  values: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FactSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const AboutSchema = new mongoose.Schema(
  {
    heading: { type: String, default: 'About me', trim: true },
    kicker: { type: String, trim: true },
    paragraphs: { type: [String], default: [] },
    imageUrl: { type: String, trim: true },
    facts: { type: [FactSchema], default: [] },
    values: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false, collection: 'about' },
);
