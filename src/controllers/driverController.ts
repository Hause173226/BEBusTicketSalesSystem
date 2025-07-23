import { Request, Response } from "express";
import { driverService } from "../services/driverService";

// Tạo mới driver
export const createDriver = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

// Lấy tất cả driver
export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// Cập nhật driver
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const driverId = req.params.id;
    const driver = await driverService.updateDriver(driverId, req.body);
    res.status(200).json(driver);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Driver not found") {
        res.status(404).json({ error: "Không tìm thấy tài xế" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

// Xóa driver
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const driverId = req.params.id;
    const driver = await driverService.deleteDriver(driverId);
    res.status(200).json(driver);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Driver not found") {
        res.status(404).json({ error: "Không tìm thấy tài xế" });
      } else if (err.message === "Only drivers with status 'inactive' or 'suspended' can be deleted" || err.message.startsWith("Cannot delete driver")) {
        res.status(400).json({ error: err.message === "Only drivers with status 'inactive' or 'suspended' can be deleted" ? "Chỉ có thể xóa tài xế có trạng thái 'ngưng hoạt động' hoặc 'đình chỉ'" : "Không thể xóa tài xế: vẫn còn chuyến đi liên kết với tài xế này" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};
