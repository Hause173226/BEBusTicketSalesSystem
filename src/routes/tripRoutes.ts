import express from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  searchTrips,
  createMultipleTrips,
  getTripsbyRouteId,
} from "../controllers/tripController";

const tripRoutes = express.Router();

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Tạo mới một chuyến xe
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route:
 *                 type: string
 *                 description: ID của tuyến đường
 *               bus:
 *                 type: string
 *                 description: ID của xe
 *               driver:
 *                 type: string
 *                 description: ID của tài xế
 *               tripCode:
 *                 type: string
 *               departureDate:
 *                 type: string
 *                 format: date
 *               departureTime:
 *                 type: string
 *                 description: Format HH:mm
 *               arrivalTime:
 *                 type: string
 *                 description: Format HH:mm
 *               basePrice:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [scheduled, in_progress, completed, cancelled]
 *               availableSeats:
 *                 type: number
 *               notes:
 *                 type: string
 *             required:
 *               - route
 *               - bus
 *               - driver
 *               - departureDate
 *               - departureTime
 *               - basePrice
 *     responses:
 *       201:
 *         description: Chuyến xe được tạo thành công
 *       500:
 *         description: Lỗi server
 */
tripRoutes.post("/", createTrip);

/**
 * @swagger
 * /api/trips/multiple:
 *   post:
 *     summary: Tạo nhiều chuyến xe tự động theo khung giờ
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripData:
 *                 type: object
 *                 properties:
 *                   route:
 *                     type: string
 *                     description: ID của tuyến đường
 *                   bus:
 *                     type: string
 *                     description: ID của xe
 *                   departureDate:
 *                     type: string
 *                     format: date
 *                   basePrice:
 *                     type: number
 *                   status:
 *                     type: string
 *                   availableSeats:
 *                     type: number
 *                   notes:
 *                     type: string
 *                 required:
 *                   - route
 *                   - bus
 *                   - departureDate
 *                   - basePrice
 *               startTime:
 *                 type: string
 *                 description: Giờ bắt đầu (định dạng HH:mm, ví dụ 06:00)
 *               endTime:
 *                 type: string
 *                 description: Giờ kết thúc (định dạng HH:mm, ví dụ 18:00)
 *               intervalHours:
 *                 type: number
 *                 description: Khoảng cách giữa các chuyến (giờ)
 *             required:
 *               - tripData
 *               - startTime
 *               - endTime
 *     responses:
 *       201:
 *         description: Danh sách chuyến xe được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Thiếu thông tin đầu vào
 *       500:
 *         description: Lỗi server
 */
tripRoutes.post("/multiple", createMultipleTrips);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Lấy danh sách tất cả chuyến xe
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Danh sách chuyến xe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   route:
 *                     type: object
 *                   bus:
 *                     type: object
 *                   driver:
 *                     type: object
 *                   tripCode:
 *                     type: string
 *                   departureDate:
 *                     type: string
 *                     format: date
 *                   departureTime:
 *                     type: string
 *                   arrivalTime:
 *                     type: string
 *                   basePrice:
 *                     type: number
 *                   status:
 *                     type: string
 *                   availableSeats:
 *                     type: number
 *       500:
 *         description: Lỗi server
 */
tripRoutes.get("/", getAllTrips);

/**
 * @swagger
 * /api/trips/search:
 *   get:
 *     summary: Tìm kiếm chuyến xe theo thông tin
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên tỉnh/thành phố hoặc tên bến xe xuất phát
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên tỉnh/thành phố hoặc tên bến xe đến nơi
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày khởi hành (định dạng YYYY-MM-DD)
 *       - in: query
 *         name: searchBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [city, station]
 *         description: "Tìm kiếm theo 'city' (tỉnh/thành phố) hoặc 'station' (tên bến xe)"
 *     responses:
 *       200:
 *         description: Danh sách chuyến xe tìm được
 *       400:
 *         description: Thông tin tìm kiếm không hợp lệ
 */

tripRoutes.get("/search", searchTrips);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Lấy thông tin một chuyến xe theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến xe
 *     responses:
 *       200:
 *         description: Thông tin chuyến xe
 *       404:
 *         description: Không tìm thấy chuyến xe
 *       500:
 *         description: Lỗi server
 */
tripRoutes.get("/:id", getTripById);

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Cập nhật thông tin chuyến xe
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến xe cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route:
 *                 type: string
 *               bus:
 *                 type: string
 *               driver:
 *                 type: string
 *               departureDate:
 *                 type: string
 *                 format: date
 *               departureTime:
 *                 type: string
 *               status:
 *                 type: string
 *               basePrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Chuyến xe được cập nhật thành công
 *       404:
 *         description: Không tìm thấy chuyến xe
 *       500:
 *         description: Lỗi server
 */
tripRoutes.put("/:id", updateTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Xóa một chuyến xe
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến xe cần xóa
 *     responses:
 *       200:
 *         description: Chuyến xe đã được xóa thành công
 *       404:
 *         description: Không tìm thấy chuyến xe
 *       500:
 *         description: Lỗi server
 */
tripRoutes.delete("/:id", deleteTrip);

/**
 * @swagger
 * /api/trips/route/{routeId}:
 *   get:
 *     summary: Lấy danh sách chuyến xe theo ID tuyến đường
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tuyến đường
 *     responses:
 *       200:
 *         description: Danh sách chuyến xe theo tuyến đường
 *       400:
 *         description: Thiếu thông tin ID tuyến đường
 *       404:
 *         description: Không tìm thấy tuyến đường hoặc chuyến xe
 */
tripRoutes.get("/route/:routeId", getTripsbyRouteId);

export default tripRoutes;
