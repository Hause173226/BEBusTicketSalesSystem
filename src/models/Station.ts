import mongoose, { Schema } from "mongoose";
import { IStation } from "../interfaces/IStation";

const stationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true },
    address: {
      street: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Station = mongoose.model<IStation>("Station", stationSchema);
