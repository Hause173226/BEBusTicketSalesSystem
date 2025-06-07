import { IUser } from './../interfaces/IUser';
import mongoose, { Schema } from "mongoose";


const customerSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    citizenId: { type: String }, // CCCD/CMND
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: { type: String },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<IUser>("Customer", customerSchema);
