import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not set');
      process.exit(1);
    }

    const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('ADMIN_EMAIL, ADMIN_USERNAME, and ADMIN_PASSWORD must be set');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = ADMIN_EMAIL;
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const admin = new User({
      username: ADMIN_USERNAME,
      email: adminEmail,
      password: ADMIN_PASSWORD,
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
