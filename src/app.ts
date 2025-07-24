import express from "express";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import ticketRoutes from "./routes/ticketRoutes";
import ticketHistoryRoutes from "./routes/ticketHistoryRoutes";
import cors from "cors";
import stationRoutes from "./routes/stationRoutes";
import tripRoutes from "./routes/tripRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import seatBookingRoutes from "./routes/seatBookingRoutes";
import routeRoutes from "./routes/routeRoutes";
import driverRoutes from "./routes/driverRoutes";
import busRoutes from "./routes/busRoutes";
import paymentRouter from "./routes/paymentRoutes";
import seatRoutes from "./routes/seatRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import path from "path";
import "./cron/tripStatusUpdater";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://fe-bus-ticket-sales-system.vercel.app",
      "https://admin-bus-ticket-sales-system.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/seat-booking", seatBookingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/api/station", stationRoutes);
app.use("/api/ticket-history", ticketHistoryRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/buses", busRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
