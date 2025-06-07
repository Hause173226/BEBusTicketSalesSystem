import mongoose, { Schema } from "mongoose";
import { IBooking } from "../interfaces/IBooking";

const bookingSchema = new Schema<IBooking>(
  {
    bookingCode: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    pickupStation: { type: Schema.Types.ObjectId, ref: "Station", required: true },
    dropoffStation: { type: Schema.Types.ObjectId, ref: "Station", required: true },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "credit_card", "e_wallet", "online"],
      default: "cash",
    },
    bookingDate: { type: Date, default: Date.now },
    paymentDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
