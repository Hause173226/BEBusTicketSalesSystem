import { Types } from "mongoose";

export interface IDriver {
  fullName: string;
  phone?: string;
  email?: string;
  licenseNumber: string;
  status?: "active" | "inactive" | "suspended";
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
}
