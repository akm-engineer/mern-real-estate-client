import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/user.js";
import authRouter from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`DB is connected`);
  })
  .catch((e) => console.log(e));

// Create an instance of the Express application
const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Parse cookies in the incoming request
app.use(cookieParser());

// Map routes to their respective routers
app.use("/api/user", router);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Custom error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

// Start the server and listen on port 4000
app.listen(4000, () => {
  console.log(`Server is running on 4000`);
});
