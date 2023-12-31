import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`DB is connected`);
  })
  .catch((e) => console.log(e));
const app = express();

app.listen(4000, () => {
  console.log(`Server is running on 4000`);
});
//ashishgk1999
//TOle2PnNjmwlur8i
//mongodb+srv://ashishgk1999:<password>@mer-estate.agwxjau.mongodb.net/?retryWrites=true&w=majority
