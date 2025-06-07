import { connectDB } from './../config/db';
export interface IBusOperator {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    connect: String;
    licenseNumber?: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
  }