import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

dotenv.config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use("/api", userRoutes);
app.use(errorHandler);

export default app;
