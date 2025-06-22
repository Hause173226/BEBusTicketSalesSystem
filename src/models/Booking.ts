import mongoose, { Schema } from "mongoose";
import { IBooking } from "../interfaces/IBooking";

const bookingSchema = new Schema<IBooking>(
  {
    bookingCode: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    pickupStation: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    dropoffStation: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    seatNumbers: {
      type: [String], // hoặc [Number] nếu ghế là số
      required: true,
    },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "credit_card", "e_wallet", "online"],
      default: "cash",
    },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
