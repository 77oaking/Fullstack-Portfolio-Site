import * as mongoose from 'mongoose';

export interface Project extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  techStack: string[];
  links: { label: string; url: string }[];
  featured: boolean;
  order: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectLinkSchema = new mongoose.Schema(
  { label: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false },
);

export const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    summary: { type: String, required: true, maxlength: 280 },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    techStack: { type: [String], default: [] },
    links: { type: [ProjectLinkSchema], default: [] },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

ProjectSchema.index({ status: 1, featured: 1, order: 1 });
