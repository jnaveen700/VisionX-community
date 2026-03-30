const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module for serving static files

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://visionx-community.netlify.app'
];

// Add production frontend URL if it's a valid URL
if (process.env.FRONTEND_URL) {
  const frontendUrl = String(process.env.FRONTEND_URL).trim();
  // Validate it's actually a URL and not undefined/null/empty
  if (frontendUrl && frontendUrl !== 'undefined' && frontendUrl.startsWith('http')) {
    allowedOrigins.push(frontendUrl);
  }
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // Allow all origins in development, restrict in production if needed
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path}`);
  console.log('Origin:', req.get('origin'));
  console.log('Host:', req.get('host'));
  next();
});

// Basic route to test if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// --- Connect to MongoDB using environment variable ---
const connectDB = async () => {
  try {
    console.log('🔄 Attempting MongoDB connection...');
    console.log('URI (masked):', process.env.MONGODB_URI?.substring(0, 30) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      socketTimeoutMS: 45000,  // 45 seconds
      serverSelectionTimeoutMS: 45000,  // 45 seconds
      connectTimeoutMS: 30000,  // 30 seconds
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Set buffer timeout for queries (increased from default 10s to 30s)
    mongoose.set('bufferTimeoutMS', 30000);
    
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// --- MongoDB Status Check Endpoint ---
app.get('/api/db-status', async (req, res) => {
  try {
    const connection = mongoose.connection;
    const status = {
      readyState: connection.readyState,
      readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][connection.readyState],
      host: connection.host,
      name: connection.name
    };
    
    if (connection.readyState === 1) {
      res.json({ status: 'ok', message: 'MongoDB connected', ...status });
    } else {
      res.status(503).json({ status: 'error', message: 'MongoDB not connected', ...status });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// --- API Routes ---
try {
  // app.use('/api/auth', require('./routes/auth')); // Auth disabled for now
  app.use('/api/questions', require('./routes/questions'));
  app.use('/api/projects', require('./routes/projects'));
  console.log('✅ Routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  process.exit(1);
}


// --- Serve static assets in production (if client is built) ---
if (process.env.NODE_ENV === 'production') {
  const path_to_client = path.join(__dirname, '../client/dist');
  // Only serve static files if build exists
  try {
    const fs = require('fs');
    if (fs.existsSync(path_to_client)) {
      app.use(express.static(path_to_client));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(path_to_client, 'index.html'));
      });
      console.log('✅ Serving frontend from client/dist');
    }
  } catch (err) {
    console.log('⚠️ Frontend build not found - running API only');
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 5000;

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
});
