import { Types } from "mongoose";

export interface ITicketDetail {
  booking: Types.ObjectId;
  seat: Types.ObjectId;
  passengerName: string;
  passengerPhone?: string;
  citizenId?: string;
  ticketPrice: number;
  seatNumber: string;
  ticketStatus?: "active" | "used" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}
