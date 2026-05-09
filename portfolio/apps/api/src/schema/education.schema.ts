import * as mongoose from 'mongoose';

export interface EducationDoc extends mongoose.Document {
  institution: string;
  institutionUrl?: string;
  institutionLogo?: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  description?: string;
  achievements: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    institutionUrl: { type: String, trim: true },
    institutionLogo: { type: String, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    gpa: { type: String, trim: true },
    description: { type: String, default: '' },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'educations' },
);
