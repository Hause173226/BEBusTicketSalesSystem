import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import ticketRoutes from "./routes/ticketRoutes";
import ticketHistoryRoutes from "./routes/ticketHistoryRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/ticket-history", ticketHistoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
