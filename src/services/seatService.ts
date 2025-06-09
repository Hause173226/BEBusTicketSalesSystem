import { Seat } from "../models/Seat";

export const seatService = {
  createSeat: async (seatData: any) => {
    const seat = await Seat.create(seatData);
    return seat;
  },

  getAllSeats: async () => {
    const seats = await Seat.find().populate("bus").lean();
    return seats;
  },

  getSeatsByBus: async (busId: string) => {
    const seats = await Seat.find({ bus: busId }).populate("bus").lean();
    return seats;
  },

  getSeatById: async (seatId: string) => {
    const seat = await Seat.findById(seatId).populate("bus");
    if (!seat) {
      throw new Error("Seat not found");
    }
    return seat;
  },

  updateSeat: async (seatId: string, updateData: any) => {
    const seat = await Seat.findByIdAndUpdate(seatId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!seat) {
      throw new Error("Seat not found");
    }
    return seat;
  },

  deleteSeat: async (seatId: string) => {
    const seat = await Seat.findByIdAndDelete(seatId);
    if (!seat) {
      throw new Error("Seat not found");
    }
    return seat;
  },

  updateSeatAvailability: async (seatId: string, isAvailable: boolean) => {
    const seat = await Seat.findByIdAndUpdate(
      seatId,
      { isAvailable },
      { new: true }
    );
    if (!seat) {
      throw new Error("Seat not found");
    }
    return seat;
  },
}; 