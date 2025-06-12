import { Request, Response } from "express";
import { busOperatorService } from "../services/busOperatorService";

// Tạo mới bus operator
export const createBusOperator = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (status && status !== "active" && status !== "inactive") {
      res.status(400).json({
        error: "Trạng thái không hợp lệ (chỉ nhận 'active' hoặc 'inactive')",
      });
      return;
    }
    const operator = await busOperatorService.createBusOperator(req.body);
    res.status(201).json(operator);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy tất cả bus operator
export const getAllBusOperators = async (req: Request, res: Response) => {
  try {
    const operators = await busOperatorService.getAllBusOperators();
    res.status(200).json(operators);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cập nhật bus operator
export const updateBusOperator = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (status && status !== "active" && status !== "inactive") {
      res.status(400).json({
        error: "Trạng thái không hợp lệ (chỉ nhận 'active' hoặc 'inactive')",
      });
      return;
    }
    const operatorId = req.params.id;
    const operator = await busOperatorService.updateBusOperator(
      operatorId,
      req.body
    );
    res.status(200).json(operator);
  } catch (err) {
    if (err instanceof Error && err.message === "Bus operator not found") {
      res.status(404).json({ error: "Bus operator not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// Xóa bus operator
export const deleteBusOperator = async (req: Request, res: Response) => {
  try {
    const operatorId = req.params.id;
    const operator = await busOperatorService.deleteBusOperator(operatorId);
    res.status(200).json(operator);
  } catch (err) {
    if (err instanceof Error && err.message === "Bus operator not found") {
      res.status(404).json({ error: "Bus operator not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
