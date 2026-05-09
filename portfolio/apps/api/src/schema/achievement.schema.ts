import * as mongoose from 'mongoose';

export interface AchievementDoc extends mongoose.Document {
  title: string;
  description: string;
  date?: string;
  icon?: string;
  link?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: String },
    icon: { type: String, trim: true },
    link: { type: String, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'achievements' },
);
