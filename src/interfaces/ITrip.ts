import { Types } from "mongoose";

export interface ITrip {
  route: Types.ObjectId;
  bus: Types.ObjectId;
  driver: Types.ObjectId;
  tripCode?: string;
  departureDate: Date;
  departureTime: string; // Stored as "HH:mm"
  arrivalTime?: string; // Stored as "HH:mm"
  basePrice: number;
  discountPercentage?: number;
  status?: "scheduled" | "in_progress" | "completed" | "cancelled";
  availableSeats?: number;
  estimatedDuration?: number; // Estimated duration in minutes
  notes?: string;
}
