import express from "express";
import {
  createBusOperator,
  getAllBusOperators,
  updateBusOperator,
  deleteBusOperator,
} from "../controllers/busOperatorController";

const busOperatorRoutes = express.Router();

/**
 * @swagger
 * /api/bus-operator:
 *   post:
 *     summary: Tạo mới một bus operator
 *     tags: [BusOperators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Bus operator được tạo thành công
 *       500:
 *         description: Lỗi server
 */
busOperatorRoutes.post("/", createBusOperator);

/**
 * @swagger
 * /api/bus-operator:
 *   get:
 *     summary: Lấy danh sách tất cả bus operators
 *     tags: [BusOperators]
 *     responses:
 *       200:
 *         description: Danh sách bus operators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Lỗi server
 */
busOperatorRoutes.get("/", getAllBusOperators);

/**
 * @swagger
 * /api/bus-operator/{id}:
 *   put:
 *     summary: Cập nhật thông tin bus operator
 *     tags: [BusOperators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bus operator cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật bus operator thành công
 *       404:
 *         description: Bus operator không tìm thấy
 *       500:
 *         description: Lỗi server
 */
busOperatorRoutes.put("/:id", updateBusOperator);

/**
 * @swagger
 * /api/bus-operator/{id}:
 *   delete:
 *     summary: Xóa một bus operator theo ID
 *     tags: [BusOperators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bus operator cần xóa
 *     responses:
 *       200:
 *         description: Xóa bus operator thành công
 *       404:
 *         description: Bus operator không tìm thấy
 *       500:
 *         description: Lỗi server
 */
busOperatorRoutes.delete("/:id", deleteBusOperator);

export default busOperatorRoutes;
