import { Driver } from "../models/Driver";

export const driverService = {
  // Tạo mới driver
  createDriver: async (driverData: any) => {
    const driver = await Driver.create(driverData);
    return driver;
  },

  // Lấy tất cả driver
  getAllDrivers: async () => {
    const drivers = await Driver.find().lean();
    return drivers;
  },

  // Cập nhật driver
  updateDriver: async (driverId: string, updateData: any) => {
    const driver = await Driver.findByIdAndUpdate(driverId, updateData, {
      new: true,
    });
    if (!driver) {
      throw new Error("Driver not found");
    }
    return driver;
  },

  // Xóa driver
  deleteDriver: async (driverId: string) => {
    const driver = await Driver.findByIdAndDelete(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }
    return driver;
  },
};
