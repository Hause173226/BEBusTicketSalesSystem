import mongoose, { Schema } from "mongoose";
import { IRoute } from "../interfaces/IRoute";

const routeSchema = new Schema<IRoute>(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true },
    originStation: [{ type: Schema.Types.ObjectId, ref: "Station", required: true }],
    destinationStation: [{ type: Schema.Types.ObjectId, ref: "Station", required: true }],
    distanceKm: { type: Number },
    estimatedDuration: { type: Number }, // in minutes
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Route = mongoose.model<IRoute>("Route", routeSchema);