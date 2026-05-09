import * as mongoose from 'mongoose';

export interface TestimonialDoc extends mongoose.Document {
  name: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  quote: string;
  rating?: number;
  link?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    link: { type: String, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'testimonials' },
);
