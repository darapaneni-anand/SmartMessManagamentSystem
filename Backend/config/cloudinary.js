import dotenv from "dotenv";
dotenv.config(); // ✅ ensures .env is loaded

import { v2 as cloudinary } from "cloudinary";


const requiredEnv = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const missing = requiredEnv.filter((k) => !process.env[k]);
export const cloudinaryConfigured = missing.length === 0;

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured successfully");
} else {
  console.warn(` Cloudinary not configured. Missing env: ${missing.join(", ")}.`);
}

export default cloudinary;
