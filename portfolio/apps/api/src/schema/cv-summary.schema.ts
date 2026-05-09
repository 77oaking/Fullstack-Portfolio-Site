import * as mongoose from 'mongoose';

export interface CvSummary extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CvSummarySchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false },
);
