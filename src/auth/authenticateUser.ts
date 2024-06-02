import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/User"; // Assuming IUser is the interface for the User model

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Verify the token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Find the user based on the userId in the token
    const user: IUser | null = await UserModel.findById(decodedToken.userId);

    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Add the authenticated user to the request object
    (req as any).user = user;

    // Move to the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticateUser;
