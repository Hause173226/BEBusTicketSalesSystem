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
 * /api/drivers:
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
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *             required:
 *               - fullName
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
 * /api/drivers:
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
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   licenseNumber:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
driverRoutes.get("/", getAllDrivers);

/**
 * @swagger
 * /api/drivers/{id}:
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
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
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
 * /api/drivers/{id}:
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
