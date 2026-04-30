import * as mongoose from 'mongoose';

export interface ContactMessage extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
  userAgent: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);
