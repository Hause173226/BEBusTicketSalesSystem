import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

export default router;
