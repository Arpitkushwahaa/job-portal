import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Check if MONGO_URI is available
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI environment variable is not set");
            if (process.env.NODE_ENV === 'production') {
                console.warn("⚠️ Running in production without database connection");
                return null;
            } else {
                throw new Error("MONGO_URI is required for development");
            }
        }

        console.log("🔄 Attempting to connect to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Connection options for better stability
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔗 Connection State: ${conn.connection.readyState}`);
        
        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        
        // Don't exit the process on Render, just log the error
        if (process.env.NODE_ENV === 'production') {
            console.error("Running in production - continuing without database connection");
            console.error("Some features may not work properly");
            return null;
        } else {
            console.error("Exiting process due to database connection failure");
            process.exit(1);
        }
    }
};

export default connectDB;