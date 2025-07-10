import { Types } from "mongoose";

export interface IBus {
  licensePlate: string;
  busType: "standard" | "sleeper" | "limousine" | "vip";
  seatCount: number;
  status?: "active" | "maintenance" | "inactive";
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
