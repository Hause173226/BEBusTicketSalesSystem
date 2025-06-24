import { Request, Response } from "express";
import { bookingService } from "../services/bookingService";

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
