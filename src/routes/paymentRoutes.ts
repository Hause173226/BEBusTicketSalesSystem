import express from "express";
import {
  createVNPayPayment,
  vnpayReturn,
  vnpayCallback,
  getBookingDetails,
} from "../controllers/paymentController";

const paymentRouter = express.Router();

// Route tạo thanh toán VNPay
paymentRouter.post("/vnpay", createVNPayPayment);

// Route xử lý khi user quay về từ VNPay
paymentRouter.get("/vnpay-return", vnpayReturn);

// Route xử lý IPN (Instant Payment Notification) từ VNPay
paymentRouter.get("/vnpay-ipn", vnpayCallback);

// Route để Frontend lấy thông tin booking sau thanh toán
paymentRouter.get("/booking-details/:orderId", getBookingDetails);

export default paymentRouter;
