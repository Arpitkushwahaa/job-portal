import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path for current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        
        // Don't exit the process on Render, just log the error
        if (process.env.NODE_ENV === 'production') {
            console.error("Running in production - continuing without database connection");
            return null;
        } else {
            console.error("Exiting process due to database connection failure");
            process.exit(1);
        }
    }
};

export default connectDB;