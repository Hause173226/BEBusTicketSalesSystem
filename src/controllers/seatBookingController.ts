import { Request, Response } from "express";
import { SeatBookingService } from "../services/seatBookingService";

export class SeatBookingController {
  // POST /api/seat-booking/init - Khởi tạo ghế cho trip
  static async initSeatsForTrip(req: Request, res: Response) {
    try {
      const { tripId, busId } = req.body;

      if (!tripId || !busId) {
        res.status(400).json({
          success: false,
          message: "tripId and busId are required",
        });
        return;
      }

      const result = await SeatBookingService.initSeatsForTrip(tripId, busId);

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/seat-booking/trip/:tripId - Lấy sơ đồ ghế
  static async getSeatMap(req: Request, res: Response) {
    try {
      const { tripId } = req.params;

      const seatMap = await SeatBookingService.getSeatMapByTrip(tripId);

      res.json({
        success: true,
        data: seatMap,
        total: seatMap.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/seat-booking/select - Chọn ghế
  static async selectSeats(req: Request, res: Response) {
    try {
      const { tripId, seatNumbers, lockDurationMinutes } = req.body;

      if (!tripId || !seatNumbers || !Array.isArray(seatNumbers)) {
        res.status(400).json({
          success: false,
          message: "tripId and seatNumbers (array) are required",
        });
        return;
      }

      const result = await SeatBookingService.selectSeats(
        tripId,
        seatNumbers,
        lockDurationMinutes
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/seat-booking/release - Hủy chọn ghế
  static async releaseSeats(req: Request, res: Response) {
    try {
      const { tripId, seatNumbers } = req.body;

      if (!tripId || !seatNumbers || !Array.isArray(seatNumbers)) {
        res.status(400).json({
          success: false,
          message: "tripId and seatNumbers (array) are required",
        });
        return;
      }

      const result = await SeatBookingService.releaseSeatSelection(
        tripId,
        seatNumbers
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/seat-booking/confirm - Xác nhận booking
  static async confirmBooking(req: Request, res: Response) {
    try {
      const { tripId, seatNumbers, bookingId } = req.body;

      if (
        !tripId ||
        !seatNumbers ||
        !bookingId ||
        !Array.isArray(seatNumbers)
      ) {
        res.status(400).json({
          success: false,
          message: "tripId, seatNumbers (array), and bookingId are required",
        });
        return;
      }

      const result = await SeatBookingService.confirmSeatBooking(
        tripId,
        seatNumbers,
        bookingId
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/seat-booking/selected/:tripId - Lấy ghế đã chọn
  static async getSelectedSeats(req: Request, res: Response) {
    try {
      const { tripId } = req.params;
      const { seatNumbers } = req.query;

      let seatNumbersArray: string[] | undefined;
      if (seatNumbers && typeof seatNumbers === "string") {
        seatNumbersArray = seatNumbers.split(",");
      }

      const selectedSeats = await SeatBookingService.getSelectedSeats(
        tripId,
        seatNumbersArray
      );

      res.json({
        success: true,
        data: selectedSeats,
        total: selectedSeats.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/seat-booking/cleanup - Cleanup expired locks
  static async cleanupExpiredLocks(req: Request, res: Response) {
    try {
      const { tripId } = req.body;

      const result = await SeatBookingService.cleanupExpiredLocks(tripId);

      res.json({
        success: true,
        message: `Released ${result.releasedSeats} expired seat locks`,
        releasedSeats: result.releasedSeats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/seat-booking/cancel - Hủy booking
  static async cancelBooking(req: Request, res: Response) {
    try {
      const { tripId, seatNumbers } = req.body;

      if (!tripId || !seatNumbers || !Array.isArray(seatNumbers)) {
        res.status(400).json({
          success: false,
          message: "tripId and seatNumbers (array) are required",
        });
        return;
      }

      const result = await SeatBookingService.cancelBooking(
        tripId,
        seatNumbers
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
