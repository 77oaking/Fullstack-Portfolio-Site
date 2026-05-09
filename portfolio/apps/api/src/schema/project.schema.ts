import * as mongoose from 'mongoose';

export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface ProjectDoc extends mongoose.Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  category?: string;
  role?: string;
  team?: string;
  liveUrl?: string;
  repoUrl?: string;
  caseStudyUrl?: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    summary: { type: String, default: '', maxlength: 320 },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    category: { type: String, trim: true },
    role: { type: String, trim: true },
    team: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    repoUrl: { type: String, trim: true },
    caseStudyUrl: { type: String, trim: true },
    startDate: { type: String },
    endDate: { type: String },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'archived'],
      default: 'completed',
      index: true,
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'projects' },
);

ProjectSchema.index({ status: 1, featured: -1, order: 1 });
