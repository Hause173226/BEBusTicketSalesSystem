import mongoose, { Schema } from "mongoose";
import { ISeat } from "../interfaces/ISeat";

const seatSchema = new Schema<ISeat>(
  {
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    seatNumber: { type: String, required: true },
    seatType: {
      type: String,
      enum: ["standard", "vip", "sleeper"],
      default: "standard",
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Đảm bảo mỗi ghế là duy nhất theo bus
seatSchema.index({ bus: 1, seatNumber: 1 }, { unique: true });

export const Seat = mongoose.model<ISeat>("Seat", seatSchema);
