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

  getBookingById: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.json(booking);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },

  updateBooking: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.updateBooking(req.params.id, req.body);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteBooking: async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.deleteBooking(req.params.id);
      res.json({ message: "Booking deleted successfully", booking });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },

  getBookingsByCustomer: async (req: Request, res: Response) => {
    try {
      const bookings = await bookingService.getBookingsByCustomer(req.params.customerId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  updateBookingStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const booking = await bookingService.updateBookingStatus(req.params.id, status);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  updatePaymentStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const booking = await bookingService.updatePaymentStatus(req.params.id, status);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}; 