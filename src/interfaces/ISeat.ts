import { Types } from "mongoose";

export interface ISeat {
  bus: Types.ObjectId; // Reference to Bus model
  seatNumber: string;
  seatType: "standard" | "vip" | "sleeper";
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
