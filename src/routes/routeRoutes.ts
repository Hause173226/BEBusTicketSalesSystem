import express from "express";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getRoutesByLocation,
  searchRoutes,
} from "../controllers/routeController";

const routeRoutes = express.Router();

/**
 * @swagger
 * /api/route:
 *   post:
 *     summary: Tạo mới một tuyến đường
 *     tags: [Routes]
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
 *               originStation:
 *                 type: string
 *                 description: ID của bến đi
 *               destinationStation:
 *                 type: string
 *                 description: ID của bến đến
 *               distanceKm:
 *                 type: number
 *                 description: Khoảng cách (km)
 *               estimatedDuration:
 *                 type: number
 *                 description: Thời gian di chuyển (phút)
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *             required:
 *               - name
 *               - code
 *               - originStation
 *               - destinationStation
 *     responses:
 *       201:
 *         description: Tuyến đường được tạo thành công
 *       500:
 *         description: Lỗi server
 */
routeRoutes.post("/", createRoute);

/**
 * @swagger
 * /api/route:
 *   get:
 *     summary: Lấy danh sách tất cả tuyến đường
 *     tags: [Routes]
 *     responses:
 *       200:
 *         description: Danh sách tuyến đường
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
 *                   originStation:
 *                     type: object
 *                   destinationStation:
 *                     type: object
 *                   distanceKm:
 *                     type: number
 *                   estimatedDuration:
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
routeRoutes.get("/", getAllRoutes);

/**
 * @swagger
 * /api/route/{id}:
 *   get:
 *     summary: Lấy thông tin tuyến đường theo ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tuyến đường
 *     responses:
 *       200:
 *         description: Thông tin tuyến đường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 code:
 *                   type: string
 *                 originStation:
 *                   type: object
 *                 destinationStation:
 *                   type: object
 *                 distanceKm:
 *                   type: number
 *                 estimatedDuration:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: Không tìm thấy tuyến đường
 *       500:
 *         description: Lỗi server
 */
routeRoutes.get("/:id", getRouteById);

/**
 * @swagger
 * /api/route/{id}:
 *   put:
 *     summary: Cập nhật thông tin tuyến đường
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tuyến đường
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
 *               originStation:
 *                 type: string
 *               destinationStation:
 *                 type: string
 *               distanceKm:
 *                 type: number
 *               estimatedDuration:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Tuyến đường được cập nhật thành công
 *       404:
 *         description: Không tìm thấy tuyến đường
 *       500:
 *         description: Lỗi server
 */
routeRoutes.put("/:id", updateRoute);

/**
 * @swagger
 * /api/route/{id}:
 *   delete:
 *     summary: Xóa một tuyến đường
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tuyến đường cần xóa
 *     responses:
 *       200:
 *         description: Tuyến đường đã được xóa thành công
 *       404:
 *         description: Không tìm thấy tuyến đường
 *       500:
 *         description: Lỗi server
 */
routeRoutes.delete("/:id", deleteRoute);

/**
 * @swagger
 * /api/route/location/{locationId}:
 *   get:
 *     summary: Lấy danh sách tuyến đường theo địa điểm
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     responses:
 *       200:
 *         description: Danh sách tuyến đường
 *       500:
 *         description: Lỗi server
 */
routeRoutes.get("/location/:locationId", getRoutesByLocation);

/**
 * @swagger
 * /api/route/search:
 *   get:
 *     summary: Tìm kiếm tuyến đường
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: originStation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bến đi
 *       - in: query
 *         name: destinationStation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bến đến
 *     responses:
 *       200:
 *         description: Danh sách tuyến đường tìm thấy
 *       400:
 *         description: Thiếu thông tin tìm kiếm
 *       500:
 *         description: Lỗi server
 */
routeRoutes.get("/search", searchRoutes);

export default routeRoutes;
