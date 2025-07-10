import { Bus } from "../models/Bus";
import { generateSeatsForBus } from "./seatService";

export const busService = {
  // Tạo mới bus
  createBus: async (busData: any) => {
    const busDataWithDefaults = {
      ...busData,
      status: busData.status || "active", // Mặc định là active nếu không có status
      seatCount: busData.seatCount || 40, // Mặc định là 40 ghế nếu không có seatCount
    };
    const bus = await Bus.create(busDataWithDefaults);

    // Tự động tạo ghế cho bus vừa tạo
    try {
      await generateSeatsForBus(bus._id.toString());
      console.log(`Successfully generated seats for bus ${bus._id}`);
    } catch (error: any) {
      console.error(`Error generating seats: ${error.message}`);
    }

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
