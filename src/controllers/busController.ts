import { Request, Response } from "express";
import { busService } from "../services/busService";

// Tạo mới bus
export const createBus = async (req: Request, res: Response) => {
  try {
    const bus = await busService.createBus(req.body);
    res.status(201).json(bus);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Seats already exist for this bus") {
        res.status(409).json({ error: "Ghế cho xe này đã tồn tại" });
      } else if (err.message === "Bus not found") {
        res.status(404).json({ error: "Không tìm thấy xe buýt" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};

// Lấy tất cả bus
export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const buses = await busService.getAllBuses();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// Cập nhật bus
export const updateBus = async (req: Request, res: Response) => {
  try {
    const busId = req.params.id;
    const bus = await busService.updateBus(busId, req.body);
    res.status(200).json(bus);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Bus not found") {
        res.status(404).json({ error: "Không tìm thấy xe buýt" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
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
    if (err instanceof Error) {
      if (err.message === "Bus not found") {
        res.status(404).json({ error: "Không tìm thấy xe buýt" });
      } else if (err.message === "Only buses with status 'inactive' can be deleted" || err.message.startsWith("Cannot delete bus")) {
        res.status(400).json({ error: err.message === "Only buses with status 'inactive' can be deleted" ? "Chỉ có thể xóa xe buýt có trạng thái 'ngưng hoạt động'" : "Không thể xóa xe buýt: vẫn còn chuyến đi liên kết với xe này" });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
};
