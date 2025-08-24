import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

// Get the directory path and set up environment variables first
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables - handle both local and Render deployment
let envPath;
if (process.env.NODE_ENV === 'production') {
    // On Render, don't try to load .env file
    console.log('Running in production mode - using environment variables from Render');
    
    // Check if required environment variables are set
    const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.warn(`⚠️  Warning: Missing required environment variables: ${missingVars.join(', ')}`);
        console.warn('Make sure these are set in your Render dashboard');
    } else {
        console.log('✅ All required environment variables are set');
    }
} else {
    // Local development - try to load .env file
    envPath = join(__dirname, '.env');
    console.log('Loading .env file from:', envPath);
    
    try {
        const result = dotenv.config({ path: envPath });
        if (result.error) {
            console.warn('Warning: .env file not found, using system environment variables');
        } else {
            console.log('Successfully loaded .env file');
        }
    } catch (error) {
        console.warn('Warning: Could not load .env file, using system environment variables');
    }
}

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// Log environment variables for debugging (excluding sensitive ones)
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI_EXISTS: process.env.MONGO_URI ? 'Yes' : 'No'
});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Robust CORS configuration for production deployment
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const hasCredentials = req.headers.cookie || req.headers.authorization;
  
  console.log(`🌐 CORS Request: ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${origin}`);
  console.log(`🌐 Has Credentials: ${hasCredentials ? 'Yes' : 'No'}`);
  
  // Handle credentials properly - if credentials are included, set specific origin
  if (origin) {
    // Allow specific origins for credentials
    const allowedOrigins = [
      'https://job-portal-two-psi.vercel.app',
      'https://job-portal-two-psi.vercel.app/',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      console.log(`🌐 CORS: Allowing origin ${origin} with credentials`);
    } else {
      // For other origins, allow but without credentials
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'false');
      console.log(`🌐 CORS: Allowing origin ${origin} without credentials`);
    }
  } else {
    // No origin header, allow all without credentials
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'false');
    console.log(`🌐 CORS: No origin header, allowing all without credentials`);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept, Cache-Control, X-HTTP-Method-Override');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`🌐 CORS: Handling preflight request for ${origin}`);
    res.status(200).end();
    return;
  }
  
  next();
});

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    next();
});

const PORT = process.env.PORT || 10000; // Default to Render's port

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Test endpoint to verify CORS
app.get("/api/v1/test", (req, res) => {
  res.json({
    message: "CORS test successful!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    hasCredentials: !!(req.headers.cookie || req.headers.authorization),
    corsHeaders: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
    }
  });
});

// CORS test endpoint with credentials
app.get("/api/v1/test-auth", (req, res) => {
  res.json({
    message: "CORS test with credentials successful!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    hasCredentials: !!(req.headers.cookie || req.headers.authorization),
    cookies: req.headers.cookie || 'No cookies',
    corsHeaders: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
    }
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not Set',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set'
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal Backend API",
    status: "Running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server starting on port ${PORT}`);
    console.log(`🌐 CORS enabled for origins: *`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URI || 'Not set'}`);
    console.log(`🌍 Server listening on 0.0.0.0:${PORT}`);
    
    // Try to connect to database but don't crash if it fails
    connectDB().then(connection => {
        if (connection) {
            console.log(`✅ Server running at port ${PORT}`);
            console.log(`📊 Database connection status: Connected`);
        } else {
            console.log(`⚠️  Server running at port ${PORT} (without database)`);
            console.log(`📊 Database connection status: Failed - check MONGO_URI`);
        }
    }).catch(error => {
        console.log(`⚠️  Server running at port ${PORT} (database connection failed)`);
        console.log(`📊 Database connection error: ${error.message}`);
    });
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error(`Try using a different port or kill the process using port ${PORT}`);
    } else {
        console.error(`❌ Server failed to start: ${error.message}`);
    }
    process.exit(1);
});
