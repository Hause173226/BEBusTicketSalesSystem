import express from "express";
import * as seatController from "../controllers/seatController";
import { authenticateJWT } from "../middlewares/authenticate";

const seatRoutes = express.Router();

// Tạo ghế cho bus
seatRoutes.post("/", authenticateJWT, seatController.generateSeatsForBus);

// Lấy danh sách ghế của bus
seatRoutes.get("/bus/:busId", seatController.getSeatsByBus);

export default seatRoutes;
