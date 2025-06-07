export interface IUser {
  fullName: string;
  phone: string;
  email?: string;
  citizenId?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
