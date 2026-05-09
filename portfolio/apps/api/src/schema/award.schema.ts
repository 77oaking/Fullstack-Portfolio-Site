import * as mongoose from 'mongoose';

export interface Award extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  issuer: string;
  date: Date;
  description: string | null;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AwardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    description: { type: String, default: null },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);
