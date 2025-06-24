import { Types } from "mongoose";

export interface ISeat {
  bus: Types.ObjectId; // Reference to Bus model
  seatNumber: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
