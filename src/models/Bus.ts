import mongoose, { Schema } from "mongoose";
import { IBus } from "../interfaces/IBus";

const busSchema = new Schema<IBus>(
  {
    operator: { type: Schema.Types.ObjectId, ref: "BusOperator", required: true },
    licensePlate: { type: String, required: true, unique: true },
    busType: { 
      type: String, 
      enum: ["standard", "sleeper", "limousine", "vip"], 
      required: true 
    },
    seatCount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["active", "maintenance", "inactive"], 
      default: "active" 
    },
  },
  { timestamps: true }
);

export const Bus = mongoose.model<IBus>("Bus", busSchema);
