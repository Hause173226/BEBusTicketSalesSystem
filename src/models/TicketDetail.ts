import mongoose, { Schema } from "mongoose";
import { ITicketDetail } from "../interfaces/ITicketDetail";

const ticketDetailSchema = new Schema<ITicketDetail>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    seat: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    passengerName: { type: String, required: true },
    passengerPhone: { type: String },
    citizenId: { type: String },
    ticketPrice: { type: Number, required: true },
    seatNumber: { type: String, required: true },
    ticketStatus: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const TicketDetail = mongoose.model<ITicketDetail>("TicketDetail", ticketDetailSchema);
