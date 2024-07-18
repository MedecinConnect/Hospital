import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is listening');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
