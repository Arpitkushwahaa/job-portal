import mongoose from "mongoose";

const connectDB = async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
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

            console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${retries})...`);
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                // Connection options for better stability
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: true // Changed to true to allow operations before connection
            });
            
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            console.log(`📊 Database: ${conn.connection.name}`);
            console.log(`🔗 Connection State: ${conn.connection.readyState}`);
            
            return conn;
        } catch (error) {
            console.error(`❌ MongoDB connection error (attempt ${attempt}/${retries}):`, error.message);
            
            if (attempt === retries) {
                // Final attempt failed
                if (process.env.NODE_ENV === 'production') {
                    console.error("Running in production - continuing without database connection");
                    console.error("Some features may not work properly");
                    return null;
                } else {
                    console.error("Exiting process due to database connection failure");
                    process.exit(1);
                }
            } else {
                // Wait before retrying
                const waitTime = attempt * 2000; // 2s, 4s, 6s
                console.log(`⏳ Retrying in ${waitTime/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }
};

export default connectDB;