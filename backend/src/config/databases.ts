import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";

export const prisma = new PrismaClient();

export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/education_platform";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const initializeDatabases = async () => {
  try {
    await connectMongoDB();
    console.log("All databases connected successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    process.exit(1);
  }
};
