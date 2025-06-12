import { Request, Response } from "express";
import { busService } from "../services/busService";

// Tạo mới bus
export const createBus = async (req: Request, res: Response) => {
  try {
    const bus = await busService.createBus(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy tất cả bus
export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const buses = await busService.getAllBuses();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cập nhật bus
export const updateBus = async (req: Request, res: Response) => {
  try {
    const busId = req.params.id;
    const bus = await busService.updateBus(busId, req.body);
    res.status(200).json(bus);
  } catch (err) {
    if (err instanceof Error && err.message === "Bus not found") {
      res.status(404).json({ error: "Bus not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// Xóa bus
export const deleteBus = async (req: Request, res: Response) => {
  try {
    const busId = req.params.id;
    const bus = await busService.deleteBus(busId);
    res.status(200).json(bus);
  } catch (err) {
    if (err instanceof Error && err.message === "Bus not found") {
      res.status(404).json({ error: "Bus not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
