import mongoose, { Schema } from "mongoose";
import { ISeatBooking } from "../interfaces/ISeatBooking";

const seatBookingSchema = new Schema<ISeatBooking>(
  {
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    seat: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    status: {
      type: String,
      enum: ["available", "selected", "booked"],
      default: "available",
    },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    lockedUntil: { type: Date },
  },
  { timestamps: true }
);

seatBookingSchema.index({ trip: 1, seat: 1 }, { unique: true });

export const SeatBooking = mongoose.model<ISeatBooking>(
  "SeatBooking",
  seatBookingSchema
);
