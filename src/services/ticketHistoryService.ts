import { TicketHistory } from "../models/TicketHistory";
import { ITicketHistory } from "../interfaces/ITicketHistory";

export const ticketHistoryService = {
    createHistoryRecord: async (historyData: Partial<ITicketHistory>) => {
        const history = await TicketHistory.create(historyData);
        return history;
    },

    getTicketHistory: async (ticketId: string) => {
        const history = await TicketHistory.find({ ticketId })
            .sort({ timestamp: -1 })
            .lean();
        return history;
    },

    getAllHistory: async () => {
        const history = await TicketHistory.find()
            .sort({ timestamp: -1 })
            .lean();
        return history;
    }
}; 