import { Request, Response } from "express";
import {
  createVNPayOrder,
  handleVNPayReturn,
  handleVNPayCallback,
  getBookingDetailsByOrderId,
} from "../services/paymentService";
import { Booking } from "../models/Booking";
import { getAppConfig } from "../utils/config";

export const createVNPayPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const { paymentUrl, orderId } = await createVNPayOrder(bookingId, req);
    res.json({ payUrl: paymentUrl, orderId });
  } catch (error: any) {
    // Xử lý các lỗi cụ thể
    if (
      error.message.includes("cancelled") ||
      error.message.includes("expired")
    ) {
      res.status(400).json({
        message: error.message,
        action: "create_new_booking", // Frontend có thể redirect đến trang booking
      });
    } else if (error.message.includes("already been paid")) {
      res.status(400).json({
        message: error.message,
        action: "show_booking_details", // Hiển thị thông tin booking
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Tạo scheduled job để tự động hủy booking quá hạn
// export const cancelExpiredBookings = async () => {
//   const expiredTime = new Date();
//   expiredTime.setHours(expiredTime.getHours() - 24); // 24h ago

//   await Booking.updateMany(
//     {
//       bookingStatus: "pending",
//       paymentStatus: "unpaid",
//       createdAt: { $lt: expiredTime },
//     },
//     {
//       bookingStatus: "cancelled",
//       paymentStatus: "failed",
//     }
//   );
// };

export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    const result = await handleVNPayReturn(req.query);
    const config = getAppConfig();

    if (result.success) {
      // Redirect về Frontend success page
      res.redirect(
        `${config.frontendUrl}/payment-success?orderId=${result.orderId}&code=${result.responseCode}`
      );
    } else {
      let message = "Thanh toán thất bại";

      switch (result.responseCode) {
        case "24":
          message = "Giao dịch đã bị hủy bởi người dùng";
          break;
        case "51":
          message = "Tài khoản không đủ số dư";
          break;
        default:
          message = `Thanh toán thất bại. Mã lỗi: ${result.responseCode}`;
      }

      res.redirect(
        `${config.frontendUrl}/payment-failed?code=${
          result.responseCode
        }&message=${encodeURIComponent(message)}&orderId=${result.orderId}`
      );
    }
  } catch (error: any) {
    console.error("VNPay return error:", error);
    const config = getAppConfig();
    res.redirect(
      `${config.frontendUrl}/payment-failed?message=${encodeURIComponent(
        "Có lỗi xảy ra"
      )}`
    );
  }
};

export const vnpayCallback = async (req: Request, res: Response) => {
  try {
    const result = await handleVNPayCallback(req.query);
    res.status(200).json({
      RspCode: result.RspCode,
      Message: result.Message,
    });
  } catch (error: any) {
    res.status(200).json({
      RspCode: "99",
      Message: "Internal Error",
    });
  }
};

export const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    const booking = await getBookingDetailsByOrderId(orderId);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error("Get booking details error:", error);

    if (
      error.message === "Order not found" ||
      error.message === "Booking not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
