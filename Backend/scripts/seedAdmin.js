import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGODB_URI not set');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'anandteja38@gmail.com';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
const fetchComplaints = async () => {
  if (!isAuthenticated) {
    setError("Please login to view complaints");
    setLoading(false);
    return;
  }

  try {
    const res = await (isAdmin() || isStaff() ? getAllComplaints() : getMyComplaints());
    setComplaints(res.data);
    setError(null);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch complaints. Please try again later.");
    console.error("Error fetching complaints:", err);
  } finally {
    setLoading(false);
  }
};
    const admin = new User({
      username: process.env.ADMIN_USERNAME || 'Anand',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Anand@2004',
      name: 'System Administrator',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created:', admin.email);
  } catch (err) {
    console.error('Failed to seed admin:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
