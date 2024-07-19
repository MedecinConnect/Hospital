import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Importer les routes
import authRoutes from './Routes/auth.js'; // Notez le .js à la fin
import userRoutes from './Routes/user.js'; // Notez le .js à la fin
import doctorRoutes from './Routes/doctor.js'; // Notez le .js à la fin
import reviewRoutes from './Routes/review.js'; // Notez le .js à la fin

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Utiliser les routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/reviews', reviewRoutes);

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

app.get('/', (req, res) => {
  res.send('API is listening');
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is listening on port ${port}`);
});
