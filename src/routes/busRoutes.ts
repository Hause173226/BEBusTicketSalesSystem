import express from "express";
import {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
} from "../controllers/busController";

const busRoutes = express.Router();

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Tạo mới một bus
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *               operator:
 *                 type: string
 *                 description: ID của operator (bắt buộc)
 *               busType:
 *                 type: string
 *                 enum: [standard, sleeper, limousine, vip]
 *               seatCount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, maintenance, inactive]
 *             required:
 *               - licensePlate
 *               - operator
 *               - busType
 *               - seatCount
 *     responses:
 *       201:
 *         description: Bus được tạo thành công
 *       500:
 *         description: Lỗi server
 */
busRoutes.post("/", createBus);

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Lấy danh sách tất cả bus
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: Danh sách bus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   operator:
 *                     type: string
 *                   licensePlate:
 *                     type: string
 *                   busType:
 *                     type: string
 *                   seatCount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
busRoutes.get("/", getAllBuses);

/**
 * @swagger
 * /api/buses/{id}:
 *   put:
 *     summary: Cập nhật thông tin bus
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bus cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operator:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *               busType:
 *                 type: string
 *                 enum: [standard, sleeper, limousine, vip]
 *               seatCount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, maintenance, inactive]
 *     responses:
 *       200:
 *         description: Cập nhật bus thành công
 *       404:
 *         description: Bus không tìm thấy
 *       500:
 *         description: Lỗi server
 */
busRoutes.put("/:id", updateBus);

/**
 * @swagger
 * /api/buses/{id}:
 *   delete:
 *     summary: Xóa một bus theo ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bus cần xóa
 *     responses:
 *       200:
 *         description: Xóa bus thành công
 *       404:
 *         description: Bus không tìm thấy
 *       500:
 *         description: Lỗi server
 */
busRoutes.delete("/:id", deleteBus);

export default busRoutes;
