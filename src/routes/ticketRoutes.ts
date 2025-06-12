import { Ticket } from './../models/Ticket';
import express from 'express';
import {
    createTicket,
    getAllTickets,
    deleteTicket,
    getTicketById,
    updateTicket
} from '../controllers/ticketController';

const ticketRoutes = express.Router();

// Create a new ticket
ticketRoutes.post('/', createTicket );

// Get all tickets
ticketRoutes.get('/', getAllTickets );

// Get ticket by ID
ticketRoutes.get('/:id', getTicketById );

// Update ticket
ticketRoutes.put('/:id', updateTicket );

// Delete ticket
ticketRoutes.delete('/:id', deleteTicket );

export default ticketRoutes;