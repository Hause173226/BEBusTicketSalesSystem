import { Customer } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc dịch vụ email khác
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (to: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME, // Phải đồng bộ với user ở trên
      to,
      subject: "Mã xác thực đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const generateOTP = (length = 6) => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, length);
};

export const userService = {
  signUp: async (userData: any) => {
    const { fullName, phone, email, password, ...rest } = userData;

    if (!fullName) {
      throw new Error("Thiếu fullName bắt buộc");
    }
    if (!phone) {
      throw new Error("Thiếu phone bắt buộc");
    }
    if (!email) {
      throw new Error("Thiếu email bắt buộc");
    }
    if (!password) {
      throw new Error("Thiếu password bắt buộc");
    }

    const existingUser = await Customer.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingUser) {
      throw new Error("Số điện thoại hoặc email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Customer.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role: "user",
      ...rest,
    });

    // Xóa password trước khi trả về
    const userObj = user.toObject() as any;
    delete userObj.password;
    return userObj;
  },

  signIn: async (email: string, password: string, role?: string) => {
    // Nếu không truyền role thì mặc định là "user"
    const userRole = role || "user";
    const user = await Customer.findOne({ email, role: userRole });
    if (!user)
      throw new Error("Email, mật khẩu hoặc quyền truy cập không đúng");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new Error("Email, mật khẩu hoặc quyền truy cập không đúng");

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = user.toObject() as any;
    delete userObj.password;
    return { user: userObj, token };
  },

  sendForgotPasswordOTP: async (email: string) => {
    const user = await Customer.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const otp = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    user.otpCode = otp;
    user.otpExpires = expires;
    await user.save();

    await sendOTPEmail(email, otp);

    return { message: "OTP đã được gửi về email" };
  },

  resendForgotPasswordOTP: async (email: string) => {
    // Gửi lại OTP mới
    return await userService.sendForgotPasswordOTP(email);
  },

  verifyOTPAndResetPassword: async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    const user = await Customer.findOne({
      email,
      otpCode: otp,
      otpExpires: { $gt: new Date() },
    });
    if (!user) throw new Error("OTP không hợp lệ hoặc đã hết hạn");

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: "Đặt lại mật khẩu thành công" };
  },

  getAllUsers: async () => {
    const users = await Customer.find().lean();
    return users;
  },

  deleteUser: async (userId: string) => {
    const user = await Customer.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};
