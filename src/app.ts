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
import tripRoutes from "./routes/tripRoutes";
import driverRoutes from "./routes/driverRoutes";
import busOperatorRoutes from "./routes/busOperatorRoutes";
import busRoutes from "./routes/busRoutes";

const app = express();

app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://busticketsalessystem.vercel.app",
    ], // Thay bằng domain FE thật của bạn
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ticket-history", ticketHistoryRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/bus-operator", busOperatorRoutes);
app.use("/api/buses", busRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
