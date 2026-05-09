import * as mongoose from 'mongoose';

export interface SkillCategoryDoc extends mongoose.Document {
  name: string;
  icon?: string;
  description?: string;
  order: number;
  items: { name: string; level?: number; yearsOfExperience?: number; icon?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, min: 0, max: 100 },
    yearsOfExperience: { type: Number, min: 0, max: 80 },
    icon: { type: String, trim: true },
  },
  { _id: false },
);

export const SkillCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    items: { type: [SkillItemSchema], default: [] },
  },
  { timestamps: true, versionKey: false, collection: 'skill_categories' },
);
