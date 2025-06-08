import { Router } from "express";
import { bookingController } from "../controllers/bookingController";

const router = Router();

// Create a new booking
router.post("/", bookingController.createBooking);

// Get all bookings
router.get("/", bookingController.getAllBookings);

// Get booking by ID
router.get("/:id", bookingController.getBookingById);

// Update booking
router.put("/:id", bookingController.updateBooking);

// Delete booking
router.delete("/:id", bookingController.deleteBooking);

// Get bookings by customer
router.get("/customer/:customerId", bookingController.getBookingsByCustomer);

// Update booking status
router.patch("/:id/status", bookingController.updateBookingStatus);

// Update payment status
router.patch("/:id/payment", bookingController.updatePaymentStatus);

export default router; 