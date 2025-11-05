import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Register new user
export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      name,
      role: 'student' // Default role is student
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // store token for logout/session management
    user.tokens = user.tokens || [];
    user.tokens.push(token);
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // persist token on user for logout
    user.tokens = user.tokens || [];
    user.tokens.push(token);
    await user.save();

    res.json({
      message: 'Logged in successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    res.json(req.user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => {
      if (update === 'name') {
        req.user.name = req.body.name;
      }
      if (update === 'password') {
        if (typeof req.body.password !== 'string' || req.body.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        req.user.password = req.body.password;
      }
    });
    await req.user.save();
    res.json(req.user.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    if (Array.isArray(req.user.tokens)) {
      req.user.tokens = req.user.tokens.filter(t => t !== req.token);
      await req.user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};