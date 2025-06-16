import { Types } from "mongoose";

export interface IRoute {
  name: string;
  code?: string;
  originStation: Types.ObjectId[];
  destinationStation: Types.ObjectId[];
 
  distanceKm?: number;
  estimatedDuration?: number;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
