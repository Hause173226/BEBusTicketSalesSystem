import { Types } from "mongoose";

export interface ISeatBooking {
  trip: Types.ObjectId; // chuyến xe
  seat: Types.ObjectId; // ghế vật lý
  status: "available" | "selected" | "booked";
  booking?: Types.ObjectId; // bookingId nếu đã đặt
  lockedUntil?: Date; // thời gian hết lock (nếu có)
  createdAt?: Date;
  updatedAt?: Date;
}
