export interface IUser {
  fullName: string;
  phone: string;
  email?: string;
  citizenId?: string;
  password: string; // Required for authentication
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
