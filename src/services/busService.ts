import { Bus } from "../models/Bus";

export const busService = {
  // Tạo mới bus
  createBus: async (busData: any) => {
    const bus = await Bus.create(busData);
    return bus;
  },

  // Lấy tất cả bus
  getAllBuses: async () => {
    const buses = await Bus.find().lean();
    return buses;
  },

  // Cập nhật bus
  updateBus: async (busId: string, updateData: any) => {
    const bus = await Bus.findByIdAndUpdate(busId, updateData, { new: true });
    if (!bus) {
      throw new Error("Bus not found");
    }
    return bus;
  },

  // Xóa bus
  deleteBus: async (busId: string) => {
    const bus = await Bus.findByIdAndDelete(busId);
    if (!bus) {
      throw new Error("Bus not found");
    }
    return bus;
  },
};
