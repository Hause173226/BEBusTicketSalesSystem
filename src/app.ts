import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", userRoutes);
app.use(errorHandler);

export default app;
