import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/user.js";
import authRouter from "./routes/auth.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`DB is connected`);
  })
  .catch((e) => console.log(e));

const app = express();
app.use(express.json());

app.use("/api/user", router);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(4000, () => {
  console.log(`Server is running on 4000`);
});
