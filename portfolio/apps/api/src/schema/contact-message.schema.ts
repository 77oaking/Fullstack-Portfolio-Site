import * as mongoose from 'mongoose';

export interface ContactMessageDoc extends mongoose.Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip?: string;
  userAgent?: string;
  read: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    read: { type: Boolean, default: false, index: true },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false, collection: 'contact_messages' },
);
