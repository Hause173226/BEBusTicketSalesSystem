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
    const { phone, password } = req.body;
    if (!phone || !password) {
      res.status(400).json({ error: "Thiếu số điện thoại hoặc mật khẩu" });
      return;
    }
    const result = await userService.signIn(phone, password);
    res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const signOut = async (req: Request, res: Response) => {
  // Nếu dùng cookie để lưu token:
  // res.clearCookie("token");
  res.status(200).json({ message: "Đăng xuất thành công" });
};

// export const signIn = async (req: Request, res: Response) => {
//   try {
//     const { phone, password } = req.body;
//     const user = await userService.signIn(phone, password);
//     res.status(200).json(user);
//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(400).json({ error: err.message });
//     } else {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// };

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
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
