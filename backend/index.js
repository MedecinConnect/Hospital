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

app.get('/', (req, res) => {
  res.send('API is listening');
});

// Database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log('MongoDB is connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => {
  connectDB();
  console.log(`Server is listening on port ${port}`);
});
