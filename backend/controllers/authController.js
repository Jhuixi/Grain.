const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Generate JWT token
const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }
    
    // Create user
    const user = await userModel.createUser(username, email, password);
    
    // Generate token
    const token = generateToken(user.user_id, user.username);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: { id: user.user_id, username: user.username, email: user.email },
        token
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message.includes('duplicate') ? 'Email already exists' : 'Registration failed' 
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await userModel.findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Generate token
    const token = generateToken(user.user_id, user.username);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.user_id, username: user.username, email: user.email },
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
};

// Get current user (protected route example)
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await userModel.findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user' 
    });
  }
};

module.exports = { register, login, getMe };