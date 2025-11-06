/**
 * Upload Service
 * Handles file uploads to Cloudinary
 */
import cloudinary, { cloudinaryConfigured } from '../config/cloudinary.js';

export const uploadImage = async (file, folder = 'smart-mess/uploads') => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Please check environment variables.');
  }

  if (!cloudinary?.uploader) {
    throw new Error('Cloudinary uploader is not available');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer);
  });
};

export const deleteImage = async (imageUrl) => {
  if (!cloudinaryConfigured || !imageUrl) {
    return;
  }

  try {
    // Extract public_id from URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
  }
};

