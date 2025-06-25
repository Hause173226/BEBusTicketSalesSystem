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
import routeRoutes from "./routes/routeRoutes";
import driverRoutes from "./routes/driverRoutes";
import busOperatorRoutes from "./routes/busOperatorRoutes";
import busRoutes from "./routes/busRoutes";
import paymentRouter from "./routes/paymentRoutes";

const app = express();

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "https://fe-bus-ticket-sales-system.vercel.app",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://fe-bus-ticket-sales-system.vercel.app",
        "https://admin-bus-ticket-sales-system.vercel.app",
      ]
    : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/api/station", stationRoutes);
app.use("/api/ticket-history", ticketHistoryRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/bus-operator", busOperatorRoutes);
app.use("/api/buses", busRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
