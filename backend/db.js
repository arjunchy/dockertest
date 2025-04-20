import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const mongoURI = "mongodb://admin:admin@mongo:27017/mydb?authSource=admin";

const connectDB = async () => {
  // const mongoURI = process.env.MONGO_URL;  // Get the URI from the environment variable
  if (!mongoURI) {
    console.error('Mongo URI is missing. Make sure you have defined MONGO_URI in your .env file.');
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;
