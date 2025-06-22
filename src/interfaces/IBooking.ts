import { Types } from "mongoose";

export interface IBooking {
  bookingCode: string;
  customer: Types.ObjectId;
  trip: Types.ObjectId;
  pickupStation: Types.ObjectId;
  dropoffStation: Types.ObjectId;
  seatNumbers: string[];
  totalAmount: number;
  bookingStatus?: "pending" | "confirmed" | "paid" | "cancelled" | "refunded";
  paymentStatus?: "unpaid" | "paid" | "refunded";
  paymentMethod?:
    | "cash"
    | "bank_transfer"
    | "credit_card"
    | "e_wallet"
    | "online";
  paymentDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
