import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

const customerSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true }, // Thêm trường password
    citizenId: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String },
  },
  { timestamps: true }
);

// Loại bỏ password khi trả về JSON
customerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const Customer = mongoose.model<IUser>("Customer", customerSchema);
