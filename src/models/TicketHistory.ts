import mongoose, { Schema } from "mongoose";
import { ITicketHistory } from "../interfaces/ITicketHistory";

const ticketHistorySchema = new Schema<ITicketHistory>(
    {
        ticketId: { type: String, required: true },
        action: { type: String, required: true, enum: ['created', 'updated', 'deleted', 'status_changed'] },
        previousStatus: { type: String },
        newStatus: { type: String },
        changes: [{
            field: { type: String },
            oldValue: { type: Schema.Types.Mixed },
            newValue: { type: Schema.Types.Mixed }
        }],
        performedBy: { type: String },
        timestamp: { type: Date, default: Date.now }
    }
);

export const TicketHistory = mongoose.model<ITicketHistory>("TicketHistory", ticketHistorySchema); 