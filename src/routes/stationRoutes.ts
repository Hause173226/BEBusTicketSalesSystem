import express from "express";
import {
  createStation,
  deleteStation,
  getAllStations,
  getStationById,
  getStationNamesAndCities,
  updateStation,
} from "../controllers/stationController";

const router = express.Router();

/**
 * @swagger
 * /api/station:
 *   post:
 *     summary: Tạo mới một trạm xe
 *     tags: [Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *             required:
 *               - name
 *               - code
 *     responses:
 *       201:
 *         description: Trạm xe được tạo thành công
 *       500:
 *         description: Lỗi server
 */
router.post("/", createStation);

/**
 * @swagger
 * /api/station:
 *   get:
 *     summary: Lấy danh sách tất cả trạm xe
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: Danh sách trạm xe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *                   address:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
router.get("/", getAllStations);

/**
 * @swagger
 * /api/station/city-names:
 *   get:
 *     summary: Lấy danh sách các trạm với tên và thành phố
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: Danh sách trạm gồm _id, name và address.city
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID của trạm
 *                   name:
 *                     type: string
 *                     description: Tên trạm
 *                   address:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         description: Thành phố
 *       500:
 *         description: Lỗi server
 */
router.get("/city-names", getStationNamesAndCities);

/**
 * @swagger
 * /api/station/{id}:
 *   get:
 *     summary: Lấy thông tin một trạm xe theo ID
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của trạm xe
 *     responses:
 *       200:
 *         description: Thông tin trạm xe
 *       404:
 *         description: Không tìm thấy trạm xe
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", getStationById);

/**
 * @swagger
 * /api/station/{id}:
 *   put:
 *     summary: Cập nhật thông tin trạm xe
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của trạm xe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy trạm xe
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", updateStation);

/**
 * @swagger
 * /api/station/{id}:
 *   delete:
 *     summary: Xóa một trạm xe theo ID
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của trạm xe cần xóa
 *     responses:
 *       200:
 *         description: Trạm xe đã được xóa thành công
 *       404:
 *         description: Không tìm thấy trạm xe
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", deleteStation);

export default router;
