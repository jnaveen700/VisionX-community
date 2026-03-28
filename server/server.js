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

// Basic route to test if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// --- Connect to MongoDB using environment variable ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

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


// --- Serve static assets in production ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
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
