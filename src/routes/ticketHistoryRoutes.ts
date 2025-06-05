import express from 'express';
import {
    getTicketHistory,
    getAllHistory
} from '../controllers/ticketHistoryController';

const router = express.Router();

// Get history for a specific ticket
router.get('/ticket/:ticketId', getTicketHistory);

// Get all ticket history
router.get('/', getAllHistory);

export default router; 