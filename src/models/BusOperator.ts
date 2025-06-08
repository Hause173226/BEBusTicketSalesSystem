import mongoose, { Schema } from "mongoose";
import { IBusOperator } from "../interfaces/IBusOperator";

const busOperatorSchema = new Schema<IBusOperator>(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    licenseNumber: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const BusOperator = mongoose.model<IBusOperator>("BusOperator", busOperatorSchema);