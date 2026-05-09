import * as mongoose from 'mongoose';

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship';

export interface ExperienceDoc extends mongoose.Document {
  role: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  location: string;
  type: EmploymentType;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, trim: true },
    companyLogo: { type: String, trim: true },
    location: { type: String, default: '' },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      default: 'full-time',
    },
    startDate: { type: String, required: true },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    achievements: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'experiences' },
);
