import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

// Get the directory path for current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables again in case they weren't loaded
dotenv.config({ path: join(dirname(__dirname), '.env') });

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Current working directory:', process.cwd());
        console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
        
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Error details:', error);
        process.exit(1);
    }
}
export default connectDB;