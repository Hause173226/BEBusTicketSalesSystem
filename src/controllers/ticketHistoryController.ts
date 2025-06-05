import { Request, Response } from "express";
import { ticketHistoryService } from "../services/ticketHistoryService";

export const getTicketHistory = async (req: Request, res: Response) => {
    try {
        const ticketId = req.params.ticketId;
        const history = await ticketHistoryService.getTicketHistory(ticketId);
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllHistory = async (req: Request, res: Response) => {
    try {
        const history = await ticketHistoryService.getAllHistory();
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}; 