import express from "express";
import { bookingController } from "../controllers/bookingController";

const router = express.Router();

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
router.post("/", bookingController.createBooking);

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
 *                   bookingDate:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Lỗi server
 */
router.get("/", bookingController.getAllBookings);

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Lấy thông tin booking theo ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của booking
 *     responses:
 *       200:
 *         description: Thông tin booking
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", bookingController.getBookingById);

/**
 * @swagger
 * /api/booking/{id}:
 *   put:
 *     summary: Cập nhật thông tin booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của booking cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: array
 *                 items:
 *                   type: string
 *               totalPrice:
 *                 type: number
 *               bookingStatus:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking được cập nhật thành công
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", bookingController.updateBooking);

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Xóa một booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của booking cần xóa
 *     responses:
 *       200:
 *         description: Booking đã được xóa thành công
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", bookingController.deleteBooking);

/**
 * @swagger
 * /api/booking/customer/{customerId}:
 *   get:
 *     summary: Lấy danh sách booking theo khách hàng
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
 *         description: Danh sách booking của khách hàng
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.get("/customer/:customerId", bookingController.getBookingsByCustomer);

/**
 * @swagger
 * /api/booking/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingStatus:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Trạng thái booking được cập nhật thành công
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/status", bookingController.updateBookingStatus);

/**
 * @swagger
 * /api/booking/{id}/payment:
 *   patch:
 *     summary: Cập nhật trạng thái thanh toán
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, refunded]
 *     responses:
 *       200:
 *         description: Trạng thái thanh toán được cập nhật thành công
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/payment", bookingController.updatePaymentStatus);

export default router;