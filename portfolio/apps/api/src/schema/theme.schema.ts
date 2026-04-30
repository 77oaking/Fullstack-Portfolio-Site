import * as mongoose from 'mongoose';
import type { ThemeTokens, ComponentOverrides } from '@portfolio/shared-types';

export interface Theme extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  themeId: string;
  name: string;
  description: string;
  preview: string;
  mode: 'light' | 'dark';
  tokens: ThemeTokens;
  components: ComponentOverrides | null;
  isBuiltIn: boolean;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ThemeSchema = new mongoose.Schema(
  {
    themeId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    preview: { type: String, default: '' },
    mode: { type: String, enum: ['light', 'dark'], required: true },
    tokens: { type: mongoose.Schema.Types.Mixed, required: true },
    components: { type: mongoose.Schema.Types.Mixed, default: null },
    isBuiltIn: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
