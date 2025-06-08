import { Booking } from "../models/Booking";
import { IBooking } from "../interfaces/IBooking";

export const bookingService = {
  createBooking: async (bookingData: Partial<IBooking>) => {
    const booking = await Booking.create(bookingData);
    return booking;
  },

  getAllBookings: async () => {
    const bookings = await Booking.find()
      .populate('customer')
      .populate('trip')
      .populate('pickupStation')
      .populate('dropoffStation')
      .lean();
    return bookings;
  },

  getBookingById: async (bookingId: string) => {
    const booking = await Booking.findById(bookingId)
      .populate('customer')
      .populate('trip')
      .populate('pickupStation')
      .populate('dropoffStation');
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  },

  updateBooking: async (bookingId: string, updateData: Partial<IBooking>) => {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    ).populate('customer')
     .populate('trip')
     .populate('pickupStation')
     .populate('dropoffStation');

    if (!booking) {
      throw new Error("Failed to update booking");
    }
    return booking;
  },

  deleteBooking: async (bookingId: string) => {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  },

  getBookingsByCustomer: async (customerId: string) => {
    const bookings = await Booking.find({ customer: customerId })
      .populate('trip')
      .populate('pickupStation')
      .populate('dropoffStation')
      .lean();
    return bookings;
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: status },
      { new: true }
    );
    if (!booking) {
      throw new Error("Failed to update booking status");
    }
    return booking;
  },

  updatePaymentStatus: async (bookingId: string, status: string) => {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        paymentStatus: status,
        paymentDate: status === 'paid' ? new Date() : undefined
      },
      { new: true }
    );
    if (!booking) {
      throw new Error("Failed to update payment status");
    }
    return booking;
  }
}; 