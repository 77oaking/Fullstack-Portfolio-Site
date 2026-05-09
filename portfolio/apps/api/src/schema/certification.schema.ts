import * as mongoose from 'mongoose';

export interface CertificationDoc extends mongoose.Document {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CertificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, required: true },
    expiryDate: { type: String },
    credentialId: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'certifications' },
);
