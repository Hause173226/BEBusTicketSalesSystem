import { Types } from "mongoose";

export interface ITrip {
  route: Types.ObjectId;
  bus: Types.ObjectId;
  tripCode?: string;
  departureDate: Date;
  departureTime: string;  // Stored as "HH:mm"
  arrivalTime?: string;   // Stored as "HH:mm"
  basePrice: number;
  status?: "scheduled" | "in_progress" | "completed" | "cancelled";
  availableSeats?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
