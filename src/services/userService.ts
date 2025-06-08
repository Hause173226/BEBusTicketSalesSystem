import { Customer } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const userService = {
  signUp: async (userData: any) => {
    const { fullName, phone, email, password, ...rest } = userData;

    if (!fullName || !phone || !password) {
      throw new Error("Thiếu thông tin bắt buộc");
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
      ...rest,
    });

    return user;
  },

  signIn: async (phone: string, password: string) => {
    // 1. Tìm user theo phone
    const user = await Customer.findOne({ phone });
    if (!user) {
      throw new Error("Số điện thoại hoặc mật khẩu không đúng");
    }

    // 2. So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Số điện thoại hoặc mật khẩu không đúng");
    }

    // 3. Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Trả về user (không password) và token
    const userObj = user.toObject() as any;
    delete userObj.password;
    return { user: userObj, token };
  },

  createUser: async (userData: { name: string; email: string }) => {
    const user = await Customer.create(userData);
    return user;
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
