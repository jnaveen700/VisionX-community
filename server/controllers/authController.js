const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config'); // Use config as fallback


exports.register = async (req, res) => {
  try {
    console.log('📝 [AUTH] Register request received');
    console.log('📝 [AUTH] Email:', req.body.email);
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.warn('⚠️ [AUTH] Missing required fields');
      return res.status(400).json({ msg: 'Please provide name, email, and password' });
    }

    // Check if user exists
    console.log('🔍 [AUTH] Checking if user exists:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.warn('⚠️ [AUTH] User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();
    console.log('✅ [AUTH] User created:', user._id);

    // Return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    const secret = process.env.JWT_SECRET || config.jwtSecret;
    const expiresIn = process.env.JWT_EXPIRATION || config.jwtExpiration;
    
    console.log('🔑 [AUTH] Creating JWT for new user');
    
    // Use process.env if available, fallback to config
    jwt.sign(
      payload,
      secret,
      { expiresIn },
      (err, token) => {
        if (err) {
          console.error('❌ [AUTH] JWT creation failed:', err);
          throw err;
        }
        console.log('✅ [AUTH] JWT created for registration');
        // Return both token and user data
        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          avatar: user.avatar,
          bio: user.bio,
          skills: user.skills,
          badges: user.badges
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error('❌ [AUTH] Register error:', err.message);
    // Return more specific error messages
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email already registered' });
    }
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('🔐 [AUTH] Login request received');
    console.log('🔐 [AUTH] Email:', req.body.email);
    
    const { email, password } = req.body;

    // Check if user exists
    console.log('🔍 [AUTH] Looking for user with email:', email);
    let user = await User.findOne({ email });
    
    if (!user) {
      console.warn('⚠️ [AUTH] User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('✅ [AUTH] User found:', user._id);

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('❌ [AUTH] Password mismatch for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('✅ [AUTH] Password verified');

    // Return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    // Use process.env if available, fallback to config
    const secret = process.env.JWT_SECRET || config.jwtSecret;
    const expiresIn = process.env.JWT_EXPIRATION || config.jwtExpiration;
    
    console.log('🔑 [AUTH] Creating JWT with expiration:', expiresIn);
    
    jwt.sign(
      payload,
      secret,
      { expiresIn },
      (err, token) => {
        if (err) {
          console.error('❌ [AUTH] JWT creation failed:', err);
          throw err;
        }
        console.log('✅ [AUTH] JWT created successfully, token length:', token.length);
        // Return both token and user data (same as register)
        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          avatar: user.avatar,
          bio: user.bio,
          skills: user.skills,
          badges: user.badges
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error('❌ [AUTH] Login error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
