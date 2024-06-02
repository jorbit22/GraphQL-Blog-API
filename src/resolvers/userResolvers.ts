import { UserInputError, AuthenticationError } from "apollo-server-express";
import UserModel from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userResolver = {
  Query: {
    getUser: async (
      _: any,
      { id }: { id: string },
      { user }: { user: any }
    ) => {
      if (!user) throw new AuthenticationError("User not authenticated");

      try {
        const foundUser = await UserModel.findById(id);
        if (!foundUser) throw new UserInputError("User not found");

        return foundUser;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error((error as Error).message);
      }
    },
    getAllUsers: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new AuthenticationError("User not authenticated");

      try {
        const users = await UserModel.find();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error((error as Error).message);
      }
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ) => {
      try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) throw new UserInputError("Email is already in use");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
          name,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign(
          { userId: newUser._id, email: newUser.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        return { token, user: newUser };
      } catch (error) {
        console.error("Error in signUp:", error);
        throw new Error((error as Error).message);
      }
    },
    signIn: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) throw new UserInputError("Invalid credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UserInputError("Invalid credentials");

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        return { token, user };
      } catch (error) {
        console.error("Error in signIn:", error);
        throw new Error((error as Error).message);
      }
    },
  },
};

export default userResolver;
