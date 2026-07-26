import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

const connectDB = async () => {
  const connUri = process.env.MONGO_URI;

  if (connUri && connUri.startsWith('mongodb+srv')) {
    try {
      console.log('Attempting to connect to MongoDB Atlas...');
      // Set serverSelectionTimeoutMS to 4000ms so it fails fast and falls back if blocked by IP whitelist
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB Atlas connection failed: ${error.message}`);
      console.log('Falling back to local in-memory MongoDB database...');
    }
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to in-memory database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
