import { Ticket } from "../models/Ticket";
import { ticketHistoryService } from "./ticketHistoryService";

export const ticketService = {
  createTicket: async (ticketData: {}) => {
    const ticket = await Ticket.create(ticketData);
    // Create history record for ticket creation
    await ticketHistoryService.createHistoryRecord({
      ticketId: ticket._id.toString(),
      action: 'created',
      newStatus: ticket.status
    });
    return ticket;
  },
  getAllTickets: async () => {
    const tickets = await Ticket.find().lean();
    return tickets;
  },
  getTicketById: async (ticketId: string) => {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return ticket;
  },
  updateTicket: async (ticketId: string, updateData: {}) => {
    const oldTicket = await Ticket.findById(ticketId);
    if (!oldTicket) {
      throw new Error("Ticket not found");
    }

    const ticket = await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
    if (!ticket) {
      throw new Error("Failed to update ticket");
    }
    
    // Create history record for ticket update
    const changes = Object.entries(updateData).map(([field, newValue]) => ({
      field,
      oldValue: oldTicket[field as keyof typeof oldTicket],
      newValue
    }));

    await ticketHistoryService.createHistoryRecord({
      ticketId: ticketId,
      action: 'updated',
      previousStatus: oldTicket.status,
      newStatus: ticket.status,
      changes
    });

    return ticket;
  },
  deleteTicket: async (ticketId: string) => {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    await Ticket.findByIdAndDelete(ticketId);
    
    // Create history record for ticket deletion
    await ticketHistoryService.createHistoryRecord({
      ticketId: ticketId,
      action: 'deleted',
      previousStatus: ticket.status
    });

    return ticket;
  },
};
