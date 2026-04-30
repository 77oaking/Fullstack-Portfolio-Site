import * as mongoose from 'mongoose';

/**
 * Single-admin model. No roles, no permissions.
 *
 * `hasAccess` exists so we can soft-revoke a token (set hasAccess=false) without
 * deleting the record.
 */
export interface Admin extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string; // bcrypt hash
  name: string;
  hasAccess: boolean;
  lastLoggedIn: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    hasAccess: { type: Boolean, required: true, default: true },
    lastLoggedIn: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);
