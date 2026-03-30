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

// --- Check if MONGODB_URI is set ---
if (!process.env.MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI environment variable is NOT set!');
  console.error('Please set MONGODB_URI in Render environment variables');
  // Don't exit, but log loudly
}

// --- Connect to MongoDB using environment variable ---
let mongoConnected = false;

const connectDB = async () => {
  try {
    console.log('🔄 Attempting MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('URI (first 50 chars):', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    
    mongoConnected = true;
    console.log('✅ Connected to MongoDB successfully');
    console.log('MongoDB host:', mongoose.connection.host);
    console.log('MongoDB db:', mongoose.connection.name);
    
    // Set buffer timeout for queries
    mongoose.set('bufferTimeoutMS', 30000);
    
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Error details:', err);
    console.log('Retrying connection in 5 seconds...');
    mongoConnected = false;
    setTimeout(connectDB, 5000);
  }
};

// Start connection immediately
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
// Middleware to check MongoDB connection before API calls
app.use('/api/questions', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ MongoDB not connected yet. State:', mongoose.connection.readyState);
    return res.status(503).json({ 
      error: 'Database initializing', 
      message: 'MongoDB connection is being established. Please try again in a few seconds.',
      dbState: mongoose.connection.readyState
    });
  }
  next();
});

app.use('/api/projects', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ MongoDB not connected yet. State:', mongoose.connection.readyState);
    return res.status(503).json({ 
      error: 'Database initializing', 
      message: 'MongoDB connection is being established. Please try again in a few seconds.',
      dbState: mongoose.connection.readyState
    });
  }
  next();
});

// --- Seed Database Endpoint (for testing) ---
app.post('/api/seed', async (req, res) => {
  try {
    console.log('🌱 Seeding database with test data...');
    const User = require('./models/User');
    const Question = require('./models/Question');
    const Project = require('./models/Project');
    const bcrypt = require('bcryptjs');
    
    // Create test user
    let testUser = await User.findOne({ email: 'test@aits.edu' });
    if (!testUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123', salt);
      
      testUser = new User({
        name: 'Test User',
        email: 'test@aits.edu',
        password: hashedPassword,
        bio: 'Test user for VisionX',
        skills: ['React', 'Node.js', 'MongoDB'],
        role: 'beginner',
        points: 0
      });
      await testUser.save();
      console.log('✅ Test user created:', testUser.email);
    } else {
      console.log('✅ Test user already exists');
    }
    
    // Create test questions
    const existingQuestions = await Question.countDocuments();
    if (existingQuestions === 0) {
      const testQuestions = [
        {
          title: 'How to implement authentication in React?',
          body: 'I want to add JWT authentication to my React app',
          author: testUser._id,
          views: 0,
          upvotes: [],
          answers: [],
          tags: ['React', 'Authentication']
        },
        {
          title: 'Best practices for MongoDB schemas?',
          body: 'What are the best practices for designing MongoDB schemas?',
          author: testUser._id,
          views: 0,
          upvotes: [],
          answers: [],
          tags: ['MongoDB', 'Database']
        },
        {
          title: 'How to optimize React performance?',
          body: 'Need tips on optimizing React component performance',
          author: testUser._id,
          views: 0,
          upvotes: [],
          answers: [],
          tags: ['React', 'Performance']
        }
      ];
      await Question.insertMany(testQuestions);
      console.log('✅ Test questions created:', testQuestions.length);
    } else {
      console.log('✅ Questions already exist');
    }
    
    // Create test projects
    const existingProjects = await Project.countDocuments();
    if (existingProjects === 0) {
      const testProjects = [
        {
          title: 'VisionX Community',
          description: 'A community platform for developers to share and learn',
          author: testUser._id,
          githubLink: 'https://github.com/example/visionx',
          liveLink: 'https://visionx.example.com',
          techStack: ['React', 'Node.js', 'MongoDB'],
          likes: [],
          images: [],
          comments: []
        },
        {
          title: 'Task Manager App',
          description: 'A simple task management application built with React',
          author: testUser._id,
          githubLink: 'https://github.com/example/task-manager',
          liveLink: 'https://task-manager.example.com',
          techStack: ['React', 'JavaScript'],
          likes: [],
          images: [],
          comments: []
        },
        {
          title: 'Chat Application',
          description: 'Real-time chat application using WebSockets',
          author: testUser._id,
          githubLink: 'https://github.com/example/chat-app',
          liveLink: 'https://chat-app.example.com',
          techStack: ['Node.js', 'Socket.io', 'React'],
          likes: [],
          images: [],
          comments: []
        }
      ];
      await Project.insertMany(testProjects);
      console.log('✅ Test projects created:', testProjects.length);
    } else {
      console.log('✅ Projects already exist');
    }
    
    res.json({ 
      msg: 'Database seeded with test data',
      user: { email: 'test@aits.edu', password: 'test123' },
      data: { questionsCount: await Question.countDocuments(), projectsCount: await Project.countDocuments() }
    });
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Load routes
try {
  app.use('/api/auth', require('./routes/auth'));
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
