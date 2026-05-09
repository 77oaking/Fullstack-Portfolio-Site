import * as mongoose from 'mongoose';

export interface BlogPostDoc extends mongoose.Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: string;
  readingMinutes?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: '', maxlength: 320 },
    body: { type: String, default: '' },
    coverImage: { type: String, trim: true },
    tags: { type: [String], default: [], index: true },
    publishedAt: { type: String },
    readingMinutes: { type: Number, min: 0 },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'blog_posts' },
);
