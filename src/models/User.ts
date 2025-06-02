import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/User";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", userSchema);
