
import mongoose from 'mongoose';

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    console.log('Attempting to connect to database...');
    const db = await mongoose.connect(process.env.MONGODB_URI, {});

    connection.isConnected = db.connections[0].readyState;
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process if DB connection fails
  }
}

export default dbConnect;
