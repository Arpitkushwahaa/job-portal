import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import companyRoutes from "./routes/company.route.js";

// Import database connection
import connectDB from "./utils/db.js";

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// Performance and Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Compression middleware for faster responses
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting for API protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

// Cache control middleware for static responses
app.use((req, res, next) => {
  // Cache successful GET requests for 5 minutes
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  }
  next();
});

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/company", companyRoutes);

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
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: "1.0.0",
    services: {
      server: "running",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    }
  });
});

// Simple health check for load balancers
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    status: "healthy",
    endpoints: {
      health: "/health",
      test: "/api/v1/test",
      testAuth: "/api/v1/test-auth",
      user: "/api/v1/user",
      job: "/api/v1/job",
      application: "/api/v1/application",
      company: "/api/v1/company"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    const dbConnection = await connectDB();
    
    if (!dbConnection && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Warning: Database connection failed, but continuing in production mode');
    }
    
    const PORT = process.env.PORT || 10000; // Default to Render's port
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server starting on port ${PORT}`);
      console.log(`🌐 CORS enabled for origins: *`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📱 Frontend URL: https://job-portal-two-psi.vercel.app`);
      console.log(`🌍 Server listening on 0.0.0.0:${PORT}`);
      console.log(`✅ Server running at port ${PORT}`);
      console.log(`📊 Database connection status: ${dbConnection ? 'Connected' : 'Failed'}`);
      console.log(`==> Your service is live 🎉`);
      console.log(`==> ///////////////////////////////////////////////////////////`);
      console.log(`==> Available at your primary URL https://job-portal-2-rrsg.onrender.com`);
      console.log(`==> ///////////////////////////////////////////////////////////`);
    }).on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying alternative port...`);
        // Try alternative port
        app.listen(0, '0.0.0.0', () => {
          console.log(`🚀 Server started on alternative port`);
        });
      } else {
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // In production, try to start server even if database fails
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Attempting to start server without database...');
      const PORT = process.env.PORT || 10000;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server started on port ${PORT} (without database)`);
        console.log(`⚠️ Some features may not work without database connection`);
      });
    } else {
      process.exit(1);
    }
  }
};

startServer();
