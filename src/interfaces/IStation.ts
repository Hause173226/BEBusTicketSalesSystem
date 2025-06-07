export interface IStation {
    name: string;
    code?: string;
    address?: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
  }