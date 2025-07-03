import { SeatBooking } from "../models/SeatBooking";
import { Seat } from "../models/Seat";
import { Types } from "mongoose";

export class SeatBookingService {
  // Khởi tạo ghế cho trip mới
  static async initSeatsForTrip(tripId: string, busId: string) {
    try {
      // Kiểm tra đã khởi tạo chưa
      const existing = await SeatBooking.findOne({ trip: tripId });
      if (existing) {
        return { message: "Seats already initialized for this trip" };
      }

      // Lấy tất cả ghế của bus
      const seats = await Seat.find({ bus: busId });
      if (seats.length === 0) {
        throw new Error("No seats found for this bus");
      }

      // Tạo SeatBooking cho mỗi ghế
      const seatBookings = seats.map((seat) => ({
        trip: new Types.ObjectId(tripId),
        seat: seat._id,
        status: "available" as const,
      }));

      await SeatBooking.insertMany(seatBookings);
      return { message: "Seats initialized successfully", count: seats.length };
    } catch (error) {
      throw error;
    }
  }

  // Lấy sơ đồ ghế cho trip (tự động cleanup expired locks)
  static async getSeatMapByTrip(tripId: string) {
    try {
      // Cleanup expired locks trước
      await this.cleanupExpiredLocks(tripId);

      // Lấy danh sách ghế với thông tin seat
      const seatBookings = await SeatBooking.find({ trip: tripId })
        .populate({
          path: "seat",
          select: "seatNumber bus",
        })
        .populate({
          path: "booking",
          select: "bookingCode customer",
          populate: {
            path: "customer",
            select: "fullName",
          },
        });

      // Sắp xếp theo thứ tự A1-A20, B1-B20
      seatBookings.sort((a, b) => {
        const seatA = a.seat as any;
        const seatB = b.seat as any;
        const [rowA, numA] = [
          seatA.seatNumber[0],
          parseInt(seatA.seatNumber.slice(1)),
        ];
        const [rowB, numB] = [
          seatB.seatNumber[0],
          parseInt(seatB.seatNumber.slice(1)),
        ];
        if (rowA === rowB) return numA - numB;
        return rowA.localeCompare(rowB);
      });

      return seatBookings.map((sb) => {
        const seat = sb.seat as any;
        const booking = sb.booking as any;
        return {
          seatBookingId: sb._id,
          seatId: seat._id,
          seatNumber: seat.seatNumber,
          status: sb.status,
          isAvailable: sb.status === "available",
          isSelected: sb.status === "selected",
          isBooked: sb.status === "booked",
          lockedUntil: sb.lockedUntil,
          bookedBy: booking?.customer?.fullName || null,
          bookingCode: booking?.bookingCode || null,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  // Chọn ghế (lock 10 phút)
  static async selectSeats(
    tripId: string,
    seatNumbers: string[],
    lockDurationMinutes: number = 10
  ) {
    try {
      // Cleanup expired locks trước
      await this.cleanupExpiredLocks(tripId);

      // 🔥 THÊM: Lấy busId từ trip
      const seatBookings = await SeatBooking.find({ trip: tripId })
        .populate("seat")
        .limit(1);

      if (seatBookings.length === 0) {
        throw new Error("Trip not initialized. Please run init API first.");
      }

      const busId = (seatBookings[0].seat as any).bus;
      const seats = await Seat.find({
        seatNumber: { $in: seatNumbers },
        bus: busId, // Thêm điều kiện này
      });

      if (seats.length !== seatNumbers.length) {
        const foundSeatNumbers = seats.map((s) => s.seatNumber);
        const notFound = seatNumbers.filter(
          (sn) => !foundSeatNumbers.includes(sn)
        );
        throw new Error(`Seats not found in this bus: ${notFound.join(", ")}`);
      }

      // ... rest of the code remains the same
      const seatIds = seats.map((s) => s._id);

      // Kiểm tra ghế có available không
      const availableSeats = await SeatBooking.find({
        trip: tripId,
        seat: { $in: seatIds },
        status: "available",
      });

      if (availableSeats.length !== seatNumbers.length) {
        const availableSeatIds = availableSeats.map((as) => as.seat.toString());
        const unavailableSeats = seats
          .filter((s) => !availableSeatIds.includes(s._id.toString()))
          .map((s) => s.seatNumber);
        throw new Error(`Seats not available: ${unavailableSeats.join(", ")}`);
      }

      // Lock ghế
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + lockDurationMinutes);

      await SeatBooking.updateMany(
        {
          trip: tripId,
          seat: { $in: seatIds },
        },
        {
          status: "selected",
          lockedUntil: lockUntil,
        }
      );

      return {
        success: true,
        message: `${seatNumbers.length} seats locked for ${lockDurationMinutes} minutes`,
        seatNumbers,
        lockedUntil: lockUntil,
      };
    } catch (error) {
      throw error;
    }
  }

  // Hủy chọn ghế
  static async releaseSeatSelection(tripId: string, seatNumbers: string[]) {
    try {
      // Lấy busId từ trip
      const seatBookings = await SeatBooking.find({ trip: tripId })
        .populate("seat")
        .limit(1);
      const busId = (seatBookings[0].seat as any).bus;

      // Tìm ghế theo busId
      const seats = await Seat.find({
        seatNumber: { $in: seatNumbers },
        bus: busId,
      });
      const seatIds = seats.map((s) => s._id);

      // ... rest of code
    } catch (error) {
      throw error;
    }
  }

  // Xác nhận booking (chuyển từ selected -> booked)
  static async confirmSeatBooking(
    tripId: string,
    seatNumbers: string[],
    bookingId: string
  ) {
    try {
      // Lấy busId từ trip
      const seatBookings = await SeatBooking.find({ trip: tripId })
        .populate("seat")
        .limit(1);
      const busId = (seatBookings[0].seat as any).bus;

      // Tìm ghế theo busId
      const seats = await Seat.find({
        seatNumber: { $in: seatNumbers },
        bus: busId,
      });
      const seatIds = seats.map((s) => s._id);

      // ... rest of code
    } catch (error) {
      throw error;
    }
  }

  // Cleanup ghế hết hạn lock
  static async cleanupExpiredLocks(tripId?: string) {
    try {
      const query: any = {
        status: "selected",
        lockedUntil: { $lt: new Date() },
      };

      if (tripId) {
        query.trip = tripId;
      }

      const result = await SeatBooking.updateMany(query, {
        status: "available",
        $unset: { lockedUntil: 1 },
      });

      return { releasedSeats: result.modifiedCount };
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin ghế đã chọn
  static async getSelectedSeats(tripId: string, seatNumbers?: string[]) {
    try {
      const query: any = { trip: tripId, status: "selected" };

      if (seatNumbers && seatNumbers.length > 0) {
        const seatBookings = await SeatBooking.find({ trip: tripId })
          .populate("seat")
          .limit(1);

        if (seatBookings.length === 0) {
          throw new Error("Trip not initialized");
        }

        const busId = (seatBookings[0].seat as any).bus;

        // Tìm ghế theo busId
        const seats = await Seat.find({
          seatNumber: { $in: seatNumbers },
          bus: busId,
        });

        const seatIds = seats.map((s) => s._id);
        query.seat = { $in: seatIds };
      }

      const selectedSeats = await SeatBooking.find(query).populate("seat");

      return selectedSeats.map((sb) => {
        const seat = sb.seat as any;
        return {
          seatId: seat._id,
          seatNumber: seat.seatNumber,
          status: sb.status,
          lockedUntil: sb.lockedUntil,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  // Hủy booking (chuyển từ booked -> available)
  static async cancelBooking(tripId: string, seatNumbers: string[]) {
    try {
      // Lấy busId từ trip
      const seatBookings = await SeatBooking.find({ trip: tripId })
        .populate("seat")
        .limit(1);
      const busId = (seatBookings[0].seat as any).bus;

      // Tìm ghế theo busId
      const seats = await Seat.find({
        seatNumber: { $in: seatNumbers },
        bus: busId,
      });
      const seatIds = seats.map((s) => s._id);

      // ... rest of code
    } catch (error) {
      throw error;
    }
  }
}
