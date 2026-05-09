import * as mongoose from 'mongoose';

export interface CvPersonal extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address: string;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const CvPersonalSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    headline: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    address: { type: String, default: '' },
    website: { type: String, default: null },
    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    photo: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);
