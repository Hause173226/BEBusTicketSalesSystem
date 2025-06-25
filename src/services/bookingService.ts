import { Booking } from "../models/Booking";
import { IBooking } from "../interfaces/IBooking";

export const bookingService = {
  createBooking: async (bookingData: Partial<IBooking>) => {
    // Tạo bookingCode: B + 5 số ngẫu nhiên
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5 số
    bookingData.bookingCode = `B${randomNumber}`;

    const booking = await Booking.create(bookingData);
    return booking;
  },

  getAllBookings: async () => {
    const bookings = await Booking.find()
      .populate("customer")
      .populate("trip")
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
};
