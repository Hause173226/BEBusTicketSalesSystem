import { Request, Response } from "express";
import * as seatService from "../services/seatService";

// POST /api/seats/generate - Tạo ghế cho bus
export async function generateSeatsForBus(req: Request, res: Response) {
  try {
    const { busId } = req.body;
    if (!busId) {
      res.status(400).json({ success: false, message: "busId is required" });
      return;
    }
    const result = await seatService.generateSeatsForBus(busId);
    res.status(201).json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// GET /api/seats/bus/:busId - Lấy danh sách ghế của bus
export async function getSeatsByBus(req: Request, res: Response) {
  try {
    const { busId } = req.params;
    const seats = await seatService.getSeatsByBus(busId);
    res.json({ success: true, data: seats });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
