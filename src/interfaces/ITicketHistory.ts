export interface ITicketHistory {
    ticketId: string;
    action: 'created' | 'updated' | 'deleted' | 'status_changed';
    previousStatus?: string;
    newStatus?: string;
    changes?: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    performedBy?: string; // User ID who performed the action
    timestamp: Date;
} 