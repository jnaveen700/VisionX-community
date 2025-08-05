const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module for serving static files

// Load environment variables from .env file if not in production
// This line should ideally be at the very top of your main server file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// --- CORS Configuration ---
// In production, your frontend will have a different URL.
// We'll use an environment variable for the frontend URL.
// During development, it will still be localhost.
const allowedOrigins = [
  'http://localhost:5173', // Your local development frontend URL
  // In Render, your frontend will get a URL like https://your-frontend-name.onrender.com
  // You'll add this URL as an environment variable in Render for your backend.
  process.env.FRONTEND_URL // This will be set in Render's environment variables for your backend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
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
    // Use the MONGODB_URI from environment variables
    // This is the Atlas connection string you provided
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // In a production environment, you might want to exit the process
    // or have more sophisticated retry logic. For now, a simple retry is fine.
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/projects', require('./routes/projects'));

// --- Serve static assets in production ---
// This is crucial if you're deploying both frontend and backend as one service
// or if your backend needs to serve the React build.
// This block should come AFTER all your API routes.
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  // Assuming your React build output is in '../client/build' relative to the server folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // For any other requests, serve the React app's index.html
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
