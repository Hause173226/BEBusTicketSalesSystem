import { User } from "../models/User";

export const userService = {
  createUser: async (userData: { name: string; email: string }) => {
    const user = await User.create(userData);
    return user;
  },
  getAllUsers: async () => {
    const users = await User.find().lean();
    return users;
  },
  deleteUser: async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};
