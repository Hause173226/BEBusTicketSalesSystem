import { TicketHistory } from './../models/TicketHistory';
import express from 'express';
import {
    getTicketHistory,
    getAllHistory
} from '../controllers/ticketHistoryController';

const ticketHistoryRoutes = express.Router();

// Get history for a specific ticket
ticketHistoryRoutes.get('/ticket/:ticketId', getTicketHistory);

// Get all ticket history
ticketHistoryRoutes.get('/', getAllHistory);

export default ticketHistoryRoutes; 