import { Booking } from "../models/Booking";
import { IBooking } from "../interfaces/IBooking";
import { SeatBookingService } from "./seatBookingService";
import { Trip } from "../models/Trip";

export const bookingService = {
  createBooking: async (bookingData: Partial<IBooking>) => {
    try {
      // BƯỚC 1: Validate input data
      const {
        trip,
        seatNumbers,
        customer,
        pickupStation,
        dropoffStation,
        totalAmount,
      } = bookingData;

      if (!trip) {
        throw new Error("Trip ID is required");
      }

      if (!seatNumbers || seatNumbers.length === 0) {
        throw new Error("At least one seat must be selected");
      }

      if (!customer) {
        throw new Error("Customer ID is required");
      }

      if (!pickupStation) {
        throw new Error("Pickup station is required");
      }

      if (!dropoffStation) {
        throw new Error("Dropoff station is required");
      }

      if (!totalAmount || totalAmount <= 0) {
        throw new Error("Total amount must be greater than 0");
      }

      // BƯỚC 2: Kiểm tra trip tồn tại và lấy bus info
      const tripData = await Trip.findById(trip).populate("bus");
      if (!tripData) {
        throw new Error("Trip not found");
      }

      if (!tripData.bus) {
        throw new Error("Bus information not found for this trip");
      }

      if (tripData.status !== "scheduled") {
        throw new Error(
          `Cannot book this trip. Trip status is "${tripData.status}". Only "scheduled" trips can be booked.`
        );
      }

      // BƯỚC 3: Kiểm tra và select ghế (10 phút lock)
      await SeatBookingService.selectSeats(
        trip.toString(),
        seatNumbers,
        10 // Lock 10 phút
      );

      // BƯỚC 4: Tạo booking code và prepare data
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      const bookingCode = `B${randomNumber}`;

      const bookingToCreate: Partial<IBooking> = {
        ...bookingData,
        bookingCode: bookingCode,
        bookingStatus: "pending",
        paymentStatus: "unpaid",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // BƯỚC 5: Tạo booking trong database
      const booking = await Booking.create(bookingToCreate);

      // BƯỚC 6: Populate thông tin chi tiết để trả về
      const populatedBooking = await Booking.findById(booking._id)
        .populate({
          path: "customer",
          select: "fullName email phone",
        })
        .populate({
          path: "trip",
          select: "departureDate departureTime arrivalTime basePrice",
          populate: {
            path: "route",
            select: "name originStation destinationStation",
            populate: [
              { path: "originStation", select: "name address" },
              { path: "destinationStation", select: "name address" },
            ],
          },
        })
        .populate("pickupStation", "name address")
        .populate("dropoffStation", "name address");

      return {
        success: true,
        data: populatedBooking,
        message:
          "Booking created and seats locked for 10 minutes. Please proceed to payment.",
        bookingCode: bookingCode,
        lockedUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 phút từ bây giờ
      };
    } catch (error: any) {
      console.error("Booking creation failed:", error.message);
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
      .sort({ createdAt: -1 })
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
