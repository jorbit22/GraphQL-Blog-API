import { ApolloServer, AuthenticationError } from "apollo-server-express";
import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import typeDefs from "./src/typeDefs/index";
import resolvers from "./src/resolvers/index";
import jwt from "jsonwebtoken";

// Load environment variables
config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "your-mongodb-uri-here");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Express middleware for JWT verification
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || "";
  try {
    if (token) {
      const decodedToken = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET as string
      );
      (req as any).user = decodedToken;
    } else {
      (req as any).user = null;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    (req as any).user = null;
  }
  next();
};

async function startServer() {
  const app = express();
  app.use(authMiddleware);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: (req as any).user }),
  });

  await server.start();
  server.applyMiddleware({ app } as any);

  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
