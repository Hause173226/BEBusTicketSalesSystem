import express from "express";
import {
  createVNPayPayment,
  vnpayReturn,
  vnpayCallback,
  getBookingDetails,
} from "../controllers/paymentController";
import { authenticateJWT } from "../middlewares/authenticate";

const paymentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * /api/payment/vnpay:
 *   post:
 *     summary: Tạo thanh toán mới qua VNPay
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID của booking cần thanh toán
 *     responses:
 *       200:
 *         description: URL thanh toán VNPay được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payUrl:
 *                   type: string
 *                   description: URL để redirect đến trang thanh toán VNPay
 *                 orderId:
 *                   type: string
 *                   description: Mã đơn hàng
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc booking không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
paymentRouter.post("/vnpay", authenticateJWT, createVNPayPayment);

/**
 * @swagger
 * /api/payment/vnpay-return:
 *   get:
 *     summary: Xử lý kết quả thanh toán từ VNPay (Client Return URL)
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: Mã phản hồi từ VNPay
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *     responses:
 *       302:
 *         description: Redirect về trang kết quả thanh toán
 */
paymentRouter.get("/vnpay-return", vnpayReturn);

/**
 * @swagger
 * /api/payment/vnpay-ipn:
 *   get:
 *     summary: Xử lý thông báo thanh toán tức thì từ VNPay (IPN URL)
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: Mã phản hồi từ VNPay
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *     responses:
 *       200:
 *         description: Phản hồi cho VNPay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 RspCode:
 *                   type: string
 *                   description: Mã phản hồi
 *                 Message:
 *                   type: string
 *                   description: Thông báo
 */
paymentRouter.get("/vnpay-ipn", vnpayCallback);

/**
 * @swagger
 * /api/payment/booking-details/{orderId}:
 *   get:
 *     summary: Lấy thông tin booking và thanh toán theo mã đơn hàng
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng cần truy vấn
 *     responses:
 *       200:
 *         description: Thông tin booking và thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookingCode:
 *                       type: string
 *                     customer:
 *                       type: object
 *                     trip:
 *                       type: object
 *                     paymentHistory:
 *                       type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
paymentRouter.get("/booking-details/:orderId", authenticateJWT, getBookingDetails);

export default paymentRouter;
