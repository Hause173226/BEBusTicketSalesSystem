import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  signIn,
  signOut,
  signUp,
} from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authenticate";

const userRoutes = express.Router();

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - fullName
 *               - phone
 *               - password
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại
 *       500:
 *         description: Lỗi server
 */
userRoutes.post("/signup", signUp);

/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - phone
 *               - password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Số điện thoại hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
userRoutes.post("/signin", signIn);

/**
 * @swagger
 * /api/user/signout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       500:
 *         description: Lỗi server
 */
userRoutes.post("/signout", signOut);

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Tạo mới một user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               citizenId:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               address:
 *                 type: string
 *             required:
 *               - fullName
 *               - phone
 *     responses:
 *       201:
 *         description: User được tạo thành công
 *       500:
 *         description: Lỗi server
 */
userRoutes.post("/", createUser);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Danh sách users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   citizenId:
 *                     type: string
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *                   address:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
userRoutes.get("/", authenticateJWT, getAllUsers);
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Xóa một user theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user cần xóa
 *     responses:
 *       200:
 *         description: User đã được xóa thành công
 *       404:
 *         description: User không tìm thấy
 *       500:
 *         description: Lỗi server
 */
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
