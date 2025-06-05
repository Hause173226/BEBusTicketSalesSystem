export interface ITicket {
    ticketNumber: string;
    departureTime: Date;
    arrivalTime: Date;
    departureLocation: string;
    arrivalLocation: string;
    price: number;
    seatNumber: string;
    status: 'available' | 'reserved' | 'sold';
    createdAt: Date;
    updatedAt: Date;
}
