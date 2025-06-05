import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController";

const router = express.Router();
/**
 * @swagger
 * /api/users:
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: User được tạo thành công
 *       500:
 *         description: Lỗi server
 */
router.post("/", createUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Danh sách users
 *       500:
 *         description: Lỗi server
 */
router.get("/", getAllUsers);
/**
 * @swagger
 * /api/users/{id}:
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
router.delete("/:id", deleteUser);

export default router;
