import mongoose, { Schema } from "mongoose";
import { ITicket } from "../interfaces/ITicket";

const ticketSchema = new Schema<ITicket>(
  {
    
    ticketNumber: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    departureLocation: { type: String, required: true },
    arrivalLocation: { type: String, required: true },
    price: { type: Number, required: true },
    seatNumber: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
