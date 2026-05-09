import * as mongoose from 'mongoose';

export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';

export interface Language extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  proficiency: LanguageProficiency;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const LanguageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ['native', 'fluent', 'advanced', 'intermediate', 'basic'],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);
