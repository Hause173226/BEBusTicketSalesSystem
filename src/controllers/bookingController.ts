import { Request, Response } from "express";
import { bookingService } from "../services/bookingService";

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    try {
      const result = await bookingService.createBooking(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        } else {
          res.status(400).json({ success: false, message: error.message });
        }
      } else {
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
      }
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
        message: "Lỗi máy chủ nội bộ",
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
          message: "Không tìm thấy lịch sử đặt vé cho người dùng này.",
        });
        return;
      }
      res.json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
      } else {
        res.status(500).json({
          success: false,
          message: "Lỗi máy chủ nội bộ",
        });
      }
    }
  },

  // Thêm hàm cancel booking
  cancelBooking: async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.params;
      const result = await bookingService.cancelBooking(bookingId);
      res.json(result);
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        } else {
          res.status(400).json({ success: false, message: error.message });
        }
      } else {
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
      }
    }
  },
};
