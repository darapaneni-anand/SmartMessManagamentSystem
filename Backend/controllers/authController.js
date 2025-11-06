import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { asyncHandler, sendSuccess, sendError, sendCreated, sendUnauthorized } from '../utils/response.js';

// Register new user
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    return sendError(res, 'All fields are required', 400);
  }

  if (password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return sendError(res, 'User with this email or username already exists', 400);
  }

  // Create new user
  const user = new User({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    name: name.trim(),
    role: 'student'
  });

  await user.save();

  // Generate token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  user.tokens = user.tokens || [];
  user.tokens.push(token);
  await user.save();

  sendCreated(res, {
    user: user.toJSON(),
    token
  }, 'User registered successfully');
});

// Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return sendUnauthorized(res, 'Invalid credentials');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendUnauthorized(res, 'Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  user.tokens = user.tokens || [];
  user.tokens.push(token);
  await user.save();

  sendSuccess(res, {
    user: user.toJSON(),
    token
  }, 'Logged in successfully');
});

// Get user profile
export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, req.user.toJSON());
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return sendError(res, 'Invalid updates', 400);
  }

  updates.forEach(update => {
    if (update === 'name') {
      req.user.name = req.body.name.trim();
    }
    if (update === 'password') {
      if (typeof req.body.password !== 'string' || req.body.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      req.user.password = req.body.password;
    }
  });

  await req.user.save();
  sendSuccess(res, req.user.toJSON(), 'Profile updated successfully');
});

// Logout user
export const logout = asyncHandler(async (req, res) => {
  if (Array.isArray(req.user.tokens)) {
    req.user.tokens = req.user.tokens.filter(t => t !== req.token);
    await req.user.save();
  }
  sendSuccess(res, null, 'Logged out successfully');
});
