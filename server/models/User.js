// This is my User model for the database
// It defines what information we store for each user
// Learning MongoDB in Web Dev class! 😊

const mongoose = require('mongoose');  // need this to create database model

// Creating user schema (learned this term in class!)
const userSchema = new mongoose.Schema({
  // Basic user info
  name: {
    type: String,
    required: true  // user must have a name!
  },
  email: {
    type: String,
    required: true,  // need email for login
    unique: true     // each email can only be used once
  },
  password: {
    type: String,
    required: true   // need password for security
  },
  bio: String,       // optional bio
  skills: [String],  // array of skills (learned about arrays in JavaScript!)
  role: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert', 'admin'],  // only these values allowed
    default: 'beginner'  // everyone starts as beginner like me :)
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: Date
  }],
  avatar: String,
  githubUsername: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
