import express from 'express';
import {
    createTicket,
    getAllTickets,
    deleteTicket,
    getTicketById,
    updateTicket
} from '../controllers/ticketController';

const router = express.Router();

// Create a new ticket
router.post('/', createTicket );

// Get all tickets
router.get('/', getAllTickets );

// Get ticket by ID
router.get('/:id', getTicketById );

// Update ticket
router.put('/:id', updateTicket );

// Delete ticket
router.delete('/:id', deleteTicket );

export default router;