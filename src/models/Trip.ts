import mongoose, { Schema } from "mongoose";
import { ITrip } from "../interfaces/ITrip";

const tripSchema = new Schema<ITrip>(
  {
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true },
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    tripCode: { type: String, unique: true },
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true }, // HH:mm format
    arrivalTime: { type: String }, // HH:mm format
    basePrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    availableSeats: { type: Number },
    notes: { type: String },
    stops: [
      {
        station: { type: Schema.Types.ObjectId, ref: "Station", required: true },
        time: { type: String, required: true }, // HH:mm format
        type: { type: String, enum: ["pickup", "dropoff"], required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Trip = mongoose.model<ITrip>("Trip", tripSchema);
