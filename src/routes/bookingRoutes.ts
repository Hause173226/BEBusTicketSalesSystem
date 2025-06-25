import express from "express";
import { bookingController } from "../controllers/bookingController";
import { authenticateJWT } from "../middlewares/authenticate";

const bookingRoutes = express.Router();

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Tạo mới một booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip:
 *                 type: string
 *                 description: ID của chuyến xe
 *               customer:
 *                 type: string
 *                 description: ID của khách hàng
 *               seatNumber:
 *                 type: array
 *                 items:
 *                   type: string
 *               totalPrice:
 *                 type: number
 *               bookingStatus:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, refunded]
 *             required:
 *               - trip
 *               - customer
 *               - seatNumber
 *               - totalPrice
 *     responses:
 *       201:
 *         description: Booking được tạo thành công
 *       500:
 *         description: Lỗi server
 */
bookingRoutes.post("/", authenticateJWT, bookingController.createBooking);

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Lấy danh sách tất cả bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Danh sách bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   trip:
 *                     type: object
 *                   customer:
 *                     type: object
 *                   seatNumber:
 *                     type: array
 *                     items:
 *                       type: string
 *                   totalPrice:
 *                     type: number
 *                   bookingStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
bookingRoutes.get("/", authenticateJWT, bookingController.getAllBookings);

/**
 * @swagger
 * /api/booking/history/{customerId}:
 *   get:
 *     summary: Lấy lịch sử booking của một user
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khách hàng
 *     responses:
 *       200:
 *         description: Danh sách bookings của user
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
bookingRoutes.get(
  "/history/:customerId",
  authenticateJWT,
  bookingController.getBookingHistory
);

export default bookingRoutes;
