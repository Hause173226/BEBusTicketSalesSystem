import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import ticketRoutes from "./routes/ticketRoutes";
import ticketHistoryRoutes from "./routes/ticketHistoryRoutes";
import cors from "cors";
import tripRoutes from "./routes/tripRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://busticketsalessystem.vercel.app",
    ], // Thay bằng domain FE thật của bạn
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/ticket-history", ticketHistoryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
