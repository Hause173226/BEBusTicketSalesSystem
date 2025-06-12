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
 * /api/bus:
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
 *                 description: ID của operator (nếu có reference)
 *               seatCount:
 *                 type: number
 *             required:
 *               - licensePlate
 *               - operator
 *     responses:
 *       201:
 *         description: Bus được tạo thành công
 *       500:
 *         description: Lỗi server
 */
busRoutes.post("/", createBus);

/**
 * @swagger
 * /api/bus:
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
 *       500:
 *         description: Lỗi server
 */
busRoutes.get("/", getAllBuses);

/**
 * @swagger
 * /api/bus/{id}:
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
 * /api/bus/{id}:
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
