import mongoose, { Schema } from "mongoose";
import { IStation } from "../interfaces/IStation";

const stationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true },
    address: { type: Object },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Station = mongoose.model<IStation>("Station", stationSchema);
