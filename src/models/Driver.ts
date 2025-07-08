import mongoose, { Schema } from "mongoose";
import { IDriver } from "../interfaces/IDriver";

const driverSchema = new Schema<IDriver>(
  {
    fullName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    licenseNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    avatar: { type: String }
  },
  { timestamps: true }
);

export const Driver = mongoose.model<IDriver>("Driver", driverSchema);
