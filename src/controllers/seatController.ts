import { Request, Response } from "express";
import { seatService } from "../services/seatService";

export const createSeat = async (req: Request, res: Response) => {
  try {
    const seat = await seatService.createSeat(req.body);
    res.status(201).json(seat);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const getAllSeats = async (req: Request, res: Response) => {
  try {
    const seats = await seatService.getAllSeats();
    res.status(200).json(seats);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSeatsByBus = async (req: Request, res: Response) => {
  try {
    const { busId } = req.params;
    const seats = await seatService.getSeatsByBus(busId);
    res.status(200).json(seats);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSeatById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seat = await seatService.getSeatById(id);
    res.status(200).json(seat);
  } catch (err) {
    if (err instanceof Error && err.message === "Seat not found") {
      res.status(404).json({ error: "Seat not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const updateSeat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seat = await seatService.updateSeat(id, req.body);
    res.status(200).json(seat);
  } catch (err) {
    if (err instanceof Error && err.message === "Seat not found") {
      res.status(404).json({ error: "Seat not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const deleteSeat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seat = await seatService.deleteSeat(id);
    res.status(200).json(seat);
  } catch (err) {
    if (err instanceof Error && err.message === "Seat not found") {
      res.status(404).json({ error: "Seat not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const updateSeatAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;
    const seat = await seatService.updateSeatAvailability(id, isAvailable);
    res.status(200).json(seat);
  } catch (err) {
    if (err instanceof Error && err.message === "Seat not found") {
      res.status(404).json({ error: "Seat not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}; 