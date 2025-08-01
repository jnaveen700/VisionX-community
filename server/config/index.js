// My project configuration file
// AITS Web Development Project - 2025

// I'm learning about environment variables, but for now keeping it simple
const config = {
  // My local MongoDB database
  mongoURI: 'mongodb://localhost:27017/visionx-community',
  
  // Secret key for JSON Web Tokens (learned about this in cybersecurity class!)
  // Note to self: In real projects, this should be in environment variables
  jwtSecret: 'aits-visionx-2025-secret',
  
  // Token expires in 24 hours
  jwtExpiration: '24h',
  
  // Project details
  projectName: 'VisionX Developer Community',
  college: 'Annamacharya Institute of Technology and Sciences',
  author: '[Your Name]',
  class: 'B.Tech CSE',
  year: '2025'
};

// Export the config so other files can use it
module.exports = config;
