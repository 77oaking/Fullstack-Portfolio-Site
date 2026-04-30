import * as mongoose from 'mongoose';

export interface Skill extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  icon: string | null;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, index: true },
    level: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    icon: { type: String, default: null },
    order: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
