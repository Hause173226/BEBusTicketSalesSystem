import { Customer } from "../models/User";

export const userService = {
  createUser: async (userData: { name: string; email: string }) => {
    const user = await Customer.create(userData);
    return user;
  },
  getAllUsers: async () => {
    const users = await Customer.find().lean();
    return users;
  },
  deleteUser: async (userId: string) => {
    const user = await Customer.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};
