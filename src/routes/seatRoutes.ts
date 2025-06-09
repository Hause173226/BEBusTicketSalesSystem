import express from "express";
import {
  createSeat,
  deleteSeat,
  getAllSeats,
  getSeatById,
  getSeatsByBus,
  updateSeat,
  updateSeatAvailability,
} from "../controllers/seatController";
import { authenticateJWT } from "../middlewares/authenticate";

const seatRoutes = express.Router();

/**
 * @swagger
 * /api/seats:
 *   post:
 *     summary: Tạo mới một ghế
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bus:
 *                 type: string
 *               seatNumber:
 *                 type: string
 *               seatType:
 *                 type: string
 *                 enum: [standard, vip, sleeper]
 *               isAvailable:
 *                 type: boolean
 *             required:
 *               - bus
 *               - seatNumber
 *     responses:
 *       201:
 *         description: Ghế được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
seatRoutes.post("/", authenticateJWT, createSeat);

/**
 * @swagger
 * /api/seats:
 *   get:
 *     summary: Lấy danh sách tất cả ghế
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách ghế
 *       500:
 *         description: Lỗi server
 */
seatRoutes.get("/", authenticateJWT, getAllSeats);

/**
 * @swagger
 * /api/seats/bus/{busId}:
 *   get:
 *     summary: Lấy danh sách ghế theo xe
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của xe
 *     responses:
 *       200:
 *         description: Danh sách ghế của xe
 *       500:
 *         description: Lỗi server
 */
seatRoutes.get("/bus/:busId", authenticateJWT, getSeatsByBus);

/**
 * @swagger
 * /api/seats/{id}:
 *   get:
 *     summary: Lấy thông tin một ghế theo ID
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ghế
 *     responses:
 *       200:
 *         description: Thông tin ghế
 *       404:
 *         description: Không tìm thấy ghế
 *       500:
 *         description: Lỗi server
 */
seatRoutes.get("/:id", authenticateJWT, getSeatById);

/**
 * @swagger
 * /api/seats/{id}:
 *   put:
 *     summary: Cập nhật thông tin ghế
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ghế
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatType:
 *                 type: string
 *                 enum: [standard, vip, sleeper]
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy ghế
 *       500:
 *         description: Lỗi server
 */
seatRoutes.put("/:id", authenticateJWT, updateSeat);

/**
 * @swagger
 * /api/seats/{id}/availability:
 *   patch:
 *     summary: Cập nhật trạng thái ghế
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ghế
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *             required:
 *               - isAvailable
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy ghế
 *       500:
 *         description: Lỗi server
 */
seatRoutes.patch("/:id/availability", authenticateJWT, updateSeatAvailability);

/**
 * @swagger
 * /api/seats/{id}:
 *   delete:
 *     summary: Xóa một ghế
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ghế
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy ghế
 *       500:
 *         description: Lỗi server
 */
seatRoutes.delete("/:id", authenticateJWT, deleteSeat);

export default seatRoutes; 