import { Types } from "mongoose";

export interface IDriver {
  fullName: string;
  phone?: string;
  email?: string;
  licenseNumber: string;
  status?: "active" | "inactive" | "suspended";
  operator: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
