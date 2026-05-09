import * as mongoose from 'mongoose';

export interface CvReference extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  position: string;
  company: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const CvReferenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    relationship: { type: String, default: null },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
