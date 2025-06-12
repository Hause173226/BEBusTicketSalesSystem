import { Request, Response } from "express";
import { driverService } from "../services/driverService";

// Tạo mới driver
export const createDriver = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy tất cả driver
export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cập nhật driver
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const driverId = req.params.id;
    const driver = await driverService.updateDriver(driverId, req.body);
    res.status(200).json(driver);
  } catch (err) {
    if (err instanceof Error && err.message === "Driver not found") {
      res.status(404).json({ error: "Driver not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
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
    if (err instanceof Error && err.message === "Driver not found") {
      res.status(404).json({ error: "Driver not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
