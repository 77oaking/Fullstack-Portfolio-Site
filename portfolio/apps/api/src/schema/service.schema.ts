import * as mongoose from 'mongoose';

export interface ServiceDoc extends mongoose.Document {
  title: string;
  description: string;
  icon?: string;
  features: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, trim: true },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'services' },
);
