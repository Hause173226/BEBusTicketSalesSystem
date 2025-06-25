import express from "express";
import { SeatBookingController } from "../controllers/seatBookingController";
import { authenticateJWT } from "../middlewares/authenticate";

const seatBookingRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SeatBooking:
 *       type: object
 *       properties:
 *         seatBookingId:
 *           type: string
 *         seatId:
 *           type: string
 *         seatNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, selected, booked]
 *         isAvailable:
 *           type: boolean
 *         isSelected:
 *           type: boolean
 *         isBooked:
 *           type: boolean
 *         lockedUntil:
 *           type: string
 *           format: date-time
 *         bookedBy:
 *           type: string
 *         bookingCode:
 *           type: string
 */

/**
 * @swagger
 * /api/seat-booking/init:
 *   post:
 *     summary: Khởi tạo ghế cho trip mới
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               busId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Khởi tạo ghế thành công
 *       400:
 *         description: Thiếu thông tin
 *       500:
 *         description: Lỗi server
 */
seatBookingRoutes.post(
  "/init",
  authenticateJWT,
  SeatBookingController.initSeatsForTrip
);

/**
 * @swagger
 * /api/seat-booking/trip/{tripId}:
 *   get:
 *     summary: Lấy sơ đồ ghế của chuyến xe
 *     tags: [Seat Booking]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sơ đồ ghế
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SeatBooking'
 */
seatBookingRoutes.get("/trip/:tripId", SeatBookingController.getSeatMap);

/**
 * @swagger
 * /api/seat-booking/select:
 *   post:
 *     summary: Chọn ghế (lock tạm thời)
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *               lockDurationMinutes:
 *                 type: number
 *                 default: 10
 *     responses:
 *       200:
 *         description: Chọn ghế thành công
 *       400:
 *         description: Ghế không khả dụng hoặc thiếu thông tin
 */
seatBookingRoutes.post(
  "/select",
  authenticateJWT,
  SeatBookingController.selectSeats
);

/**
 * @swagger
 * /api/seat-booking/release:
 *   post:
 *     summary: Hủy chọn ghế
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Hủy chọn ghế thành công
 */
seatBookingRoutes.post(
  "/release",
  authenticateJWT,
  SeatBookingController.releaseSeats
);

/**
 * @swagger
 * /api/seat-booking/confirm:
 *   post:
 *     summary: Xác nhận booking ghế
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác nhận booking thành công
 */
seatBookingRoutes.post(
  "/confirm",
  authenticateJWT,
  SeatBookingController.confirmBooking
);

/**
 * @swagger
 * /api/seat-booking/selected/{tripId}:
 *   get:
 *     summary: Lấy danh sách ghế đã chọn
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: seatNumbers
 *         schema:
 *           type: string
 *         description: Danh sách seat numbers cách nhau bởi dấu phẩy
 *     responses:
 *       200:
 *         description: Danh sách ghế đã chọn
 */
seatBookingRoutes.get(
  "/selected/:tripId",
  authenticateJWT,
  SeatBookingController.getSelectedSeats
);

/**
 * @swagger
 * /api/seat-booking/cleanup:
 *   post:
 *     summary: Cleanup ghế hết hạn lock
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cleanup thành công
 */
seatBookingRoutes.post(
  "/cleanup",
  authenticateJWT,
  SeatBookingController.cleanupExpiredLocks
);

/**
 * @swagger
 * /api/seat-booking/cancel:
 *   post:
 *     summary: Hủy booking ghế
 *     tags: [Seat Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Hủy booking thành công
 */
seatBookingRoutes.post(
  "/cancel",
  authenticateJWT,
  SeatBookingController.cancelBooking
);

export default seatBookingRoutes;
