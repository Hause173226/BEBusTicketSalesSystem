import { Request, Response } from "express";
import { ticketService } from "../services/ticketService";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.getTicketById(ticketId);
    res.status(200).json(ticket);
  } catch (err) {
    if (err instanceof Error && err.message === "Ticket not found") {
      res.status(404).json({ error: "Ticket not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.updateTicket(ticketId, req.body);
    res.status(200).json(ticket);
  } catch (err) {
    if (err instanceof Error && err.message === "Ticket not found") {
      res.status(404).json({ error: "Ticket not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.deleteTicket(ticketId);
    res.status(200).json(ticket);
  } catch (err) {
    if (err instanceof Error && err.message === "Ticket not found") {
      res.status(404).json({ error: "Ticket not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
