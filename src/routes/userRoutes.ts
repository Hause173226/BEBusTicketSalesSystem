import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController";

const router = express.Router();
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
router.post("/", createUser);

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
router.get("/", getAllUsers);
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
router.delete("/:id", deleteUser);

export default router;
