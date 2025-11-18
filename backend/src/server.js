require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/connection');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const petaniRoutes = require('./routes/petani');
const kelompokTaniRoutes = require('./routes/kelompokTaniRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/petani', petaniRoutes);
app.use('/api/kelompok-tani', kelompokTaniRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}`);
      console.log(`✅ CORS enabled for: ${corsOptions.origin}`);
      console.log('='.repeat(50));
      console.log('Available endpoints:');
      console.log(`  GET    /health`);
      console.log(`  GET    /api/petani`);
      console.log(`  GET    /api/petani/stats`);
      console.log(`  GET    /api/petani/:id`);
      console.log(`  POST   /api/petani`);
      console.log(`  PUT    /api/petani/:id`);
      console.log(`  DELETE /api/petani/:id`);
      console.log(`  GET    /api/kelompok-tani`);
      console.log(`  GET    /api/kelompok-tani/stats`);
      console.log(`  GET    /api/kelompok-tani/:id`);
      console.log(`  POST   /api/kelompok-tani`);
      console.log(`  PUT    /api/kelompok-tani/:id`);
      console.log(`  DELETE /api/kelompok-tani/:id`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
