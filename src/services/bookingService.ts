import { Booking } from "../models/Booking";
import { IBooking } from "../interfaces/IBooking";
import { SeatBookingService } from "./seatBookingService";

export const bookingService = {
  createBooking: async (bookingData: Partial<IBooking>) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      const { trip, seatNumbers } = bookingData;
      if (
        !trip ||
        !seatNumbers ||
        !Array.isArray(seatNumbers) ||
        seatNumbers.length === 0
      ) {
        throw new Error("Trip ID and seat numbers are required");
      }

      // 1. Kiểm tra ghế có đang được selected (locked) không
      const selectedSeats = await SeatBookingService.getSelectedSeats(
        trip.toString(),
        seatNumbers
      );
      if (selectedSeats.length !== seatNumbers.length) {
        throw new Error(
          "Some seats are not properly selected or have expired. Please reselect your seats."
        );
      }

      // 2. Tạo bookingCode: B + 5 số ngẫu nhiên
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      bookingData.bookingCode = `B${randomNumber}`;

      // 3. Tạo booking
      const booking = await Booking.create(bookingData);

      // 4. Xác nhận ghế (chuyển từ 'selected' -> 'booked')
      // await SeatBookingService.confirmSeatBooking(
      //   trip.toString(),
      //   seatNumbers,
      //   booking._id.toString()
      // );

      // 5. Trả về booking đã tạo
      return {
        success: true,
        data: booking,
        message: "Booking created successfully",
      };
    } catch (error: any) {
      throw new Error(`Booking creation failed: ${error.message}`);
    }
  },

  getAllBookings: async () => {
    const bookings = await Booking.find()
      .populate("customer")
      .populate({
        path: "trip",
        populate: {
          path: "route",
          select: "name originStation destinationStation",
          populate: [
            { path: "originStation", select: "name address" },
            { path: "destinationStation", select: "name address" },
          ],
        },
      })
      .populate("pickupStation")
      .populate("dropoffStation")
      .lean();
    return bookings;
  },

  getBookingHistory: async (customerId: string) => {
    const bookings = await Booking.find({ customer: customerId })
      .populate("trip")
      .populate("pickupStation")
      .populate("dropoffStation")
      .lean();
    return bookings;
  },

  // Thêm hàm hủy booking
  cancelBooking: async (bookingId: string) => {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.bookingStatus === "cancelled") {
        throw new Error("Booking is already cancelled");
      }

      // Cập nhật trạng thái booking
      booking.bookingStatus = "cancelled";
      await booking.save();

      // Hủy ghế trong SeatBooking (chuyển về available)
      await SeatBookingService.cancelBooking(
        booking.trip.toString(),
        booking.seatNumbers
      );

      return {
        success: true,
        message: "Booking cancelled successfully",
      };
    } catch (error: any) {
      throw new Error(`Cancel booking failed: ${error.message}`);
    }
  },
};
