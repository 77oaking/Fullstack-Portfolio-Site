import * as mongoose from 'mongoose';

export interface Experience extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  role: string;
  company: string;
  companyLogo: string | null;
  location: string;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  bullets: string[];
  techStack: string[];
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String, default: null },
    location: { type: String, default: '' },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, default: null },
    summary: { type: String, default: '' },
    bullets: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
