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
    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }
    if (driver.status !== "inactive" && driver.status !== "suspended") {
      throw new Error("Only drivers with status 'inactive' or 'suspended' can be deleted");
    }
    // Kiểm tra còn trip nào liên kết không
    const tripCount = await require("../models/Trip").Trip.countDocuments({ driver: driverId });
    if (tripCount > 0) {
      throw new Error("Cannot delete driver: there are trips linked to this driver");
    }
    await Driver.findByIdAndDelete(driverId);
    return driver;
  },
};
