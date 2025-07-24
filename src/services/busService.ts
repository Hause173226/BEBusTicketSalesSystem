import { Bus } from "../models/Bus";
import { generateSeatsForBus } from "./seatService";

export const busService = {
  // Tạo mới bus
  createBus: async (busData: any) => {
    // Xác định số ghế mặc định theo loại xe
    const defaultSeatCounts: Record<string, number> = {
      standard: 40,
      sleeper: 32,
      limousine: 28,
      vip: 20,
    };

    const seatCount =
      busData.seatCount || defaultSeatCounts[busData.busType] || 40; // fallback nếu không xác định được loại xe

    const busDataWithDefaults = {
      ...busData,
      status: busData.status || "active",
      seatCount,
    };

    const bus = await Bus.create(busDataWithDefaults);

    // Tự động tạo ghế cho bus vừa tạo
    try {
      await generateSeatsForBus(bus._id.toString(), seatCount); // truyền seatCount vào
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
    const bus = await Bus.findById(busId);
    if (!bus) {
      throw new Error("Bus not found");
    }
    if (bus.status !== "inactive") {
      throw new Error("Chỉ được xóa xe có trạng thái 'ngừng hoạt động'");
    }
    // Kiểm tra còn trip nào liên kết không
    const tripCount = await require("../models/Trip").Trip.countDocuments({ bus: busId });
    if (tripCount > 0) {
      throw new Error("Không thể xóa xe: vẫn còn chuyến xe liên kết với xe này");
    }
    await Bus.findByIdAndDelete(busId);
    return bus;
  },
};
