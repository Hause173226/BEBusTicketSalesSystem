import { Request, Response } from "express";
import { userService } from "../services/userService";

export const signUp = async (req: Request, res: Response) => {
  try {
    const user = await userService.signUp(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
      return;
    }
    const result = await userService.signIn(email, password, role);
    res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Vui lòng nhập email" });
      return;
    }
    const result = await userService.sendForgotPasswordOTP(email);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Lỗi server" });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Vui lòng nhập email" });
      return;
    }
    const result = await userService.resendForgotPasswordOTP(email);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Lỗi server" });
  }
};

export const resetPasswordWithOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ error: "Thiếu thông tin" });
      return;
    }
    const result = await userService.verifyOTPAndResetPassword(
      email,
      otp,
      newPassword
    );
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Lỗi server" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  // Nếu dùng cookie để lưu token:
  // res.clearCookie("token");
  res.status(200).json({ message: "Đăng xuất thành công" });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.deleteUser(userId);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error && err.message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error && err.message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUser(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400).json({ error: "New password is required" });
      return;
    }
    const result = await userService.changePassword(userId, newPassword);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;
    if (typeof isActive === "undefined") {
      res.status(400).json({ error: "isActive is required" });
      return;
    }
    const updatedUser = await userService.changeUserStatus(userId, isActive);
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};



