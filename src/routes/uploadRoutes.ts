import express from "express";
import { uploadSingle, uploadImage } from "../controllers/uploadController";

const router = express.Router();

router.post("/", uploadSingle, uploadImage);

export default router; 