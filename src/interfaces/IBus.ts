import { Types } from "mongoose";

export interface IBus {
  operator: Types.ObjectId;
  licensePlate: string;
  busType: "standard" | "sleeper" | "limousine" | "vip";
  seatCount: number;
  status?: "active" | "maintenance" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
