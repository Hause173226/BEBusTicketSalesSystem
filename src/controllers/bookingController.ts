import { Request, Response } from "express";
import { bookingService } from "../services/bookingService";

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    try {
      const result = await bookingService.createBooking(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  getAllBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getBookingHistory: async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const bookings = await bookingService.getBookingHistory(customerId);
      if (!bookings || bookings.length === 0) {
        res.status(404).json({
          success: false,
          message: "No bookings found for this user.",
        });
        return;
      }
      res.json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Thêm hàm cancel booking
  cancelBooking: async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.params;
      const result = await bookingService.cancelBooking(bookingId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
