import mongoose from 'mongoose';

const connectDB = async () => {
  const connUri = process.env.MONGO_URI;

  if (connUri && connUri.startsWith('mongodb+srv')) {
    try {
      console.log('Attempting to connect to MongoDB Atlas...');
      // Set serverSelectionTimeoutMS so it returns fast in case of issues
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 6000,
      });
      console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB Atlas connection failed: ${error.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      console.log('Falling back to local in-memory MongoDB database...');
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI is required and must connect successfully in production');
  }

  try {
    // Dynamic import to prevent package loading issues in serverless environments
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to in-memory database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
