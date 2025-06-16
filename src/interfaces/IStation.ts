export interface IStation {
    name: string;
    code?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
    };
    status?: 'active' | 'inactive';
    createdAt?: Date;
  }