import express from "express";
import {
  createDriver,
  getAllDrivers,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController";

const driverRoutes = express.Router();

/**
 * @swagger
 * /api/driver:
 *   post:
 *     summary: Tạo mới một driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               operator:
 *                 type: string
 *                 description: ID của operator (nếu có reference)
 *             required:
 *               - name
 *               - phone
 *               - licenseNumber
 *     responses:
 *       201:
 *         description: Driver được tạo thành công
 *       500:
 *         description: Lỗi server
 */
driverRoutes.post("/", createDriver);

/**
 * @swagger
 * /api/driver:
 *   get:
 *     summary: Lấy danh sách tất cả drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: Danh sách drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Lỗi server
 */
driverRoutes.get("/", getAllDrivers);

/**
 * @swagger
 * /api/driver/{id}:
 *   put:
 *     summary: Cập nhật thông tin driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của driver cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật driver thành công
 *       404:
 *         description: Driver không tìm thấy
 *       500:
 *         description: Lỗi server
 */
driverRoutes.put("/:id", updateDriver);

/**
 * @swagger
 * /api/driver/{id}:
 *   delete:
 *     summary: Xóa một driver theo ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của driver cần xóa
 *     responses:
 *       200:
 *         description: Xóa driver thành công
 *       404:
 *         description: Driver không tìm thấy
 *       500:
 *         description: Lỗi server
 */
driverRoutes.delete("/:id", deleteDriver);

export default driverRoutes;
