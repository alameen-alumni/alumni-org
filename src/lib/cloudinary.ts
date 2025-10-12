// Cloudinary upload helper function with Firebase Storage fallback
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const cloudConfigured = !!cloudName && cloudName !== 'your_cloud_name' && !!uploadPreset && uploadPreset !== 'your_upload_preset';

  if (!cloudConfigured) {
    console.warn('Cloudinary not configured properly, will use Firebase Storage fallback.');
  }

  if (cloudConfigured) {
    console.log('Attempting upload to Cloudinary:', {
      cloudName,
      uploadPreset,
      fileName: file.name,
      fileSize: file.size
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset as string);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Cloudinary response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Cloudinary upload successful:', data.secure_url);
      return data.secure_url;
    } catch (cloudErr) {
      console.error('Cloudinary upload error, falling back to Firebase Storage:', cloudErr);
      // proceed to fallback below
    }
  }

  // Fallback: upload to Firebase Storage
  try {
    const path = `fallback_uploads/${Date.now()}_${file.name}`;
    const sRef = storageRef(storage, path);
    await uploadBytes(sRef, file);
    const downloadURL = await getDownloadURL(sRef);
    console.log('Uploaded to Firebase Storage fallback:', downloadURL);
    return downloadURL;
  } catch (storageErr) {
    console.error('Firebase Storage fallback failed:', storageErr);
    throw storageErr;
  }
};

// Function to upload multiple images and return URLs
export const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};

// Function to clear image previews from localStorage
export const clearImagePreviews = (fieldNames: string[]) => {
  fieldNames.forEach(fieldName => {
    localStorage.removeItem(`imagePreview_${fieldName}`);
  });
};

// Function to delete image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    console.log('Not a Cloudinary URL, skipping deletion:', imageUrl);
    return;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

  // Check if environment variables are set
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials not configured for deletion. Image will remain in Cloudinary.');
    return;
  }

  try {
    // Extract public ID from URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) {
      console.warn('Could not extract public ID from URL:', imageUrl);
      return;
    }

    const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
    console.log('Deleting from Cloudinary:', publicId);

    // Note: This requires server-side implementation for security
    // For now, we'll log the public ID for manual deletion
    console.log(`To delete image from Cloudinary, use public ID: ${publicId}`);
    console.log('Manual deletion required due to security restrictions');

  } catch (error) {
    console.error('Error preparing Cloudinary deletion:', error);
  }
};

// Function to delete multiple images from Cloudinary
export const deleteMultipleFromCloudinary = async (imageUrls: string[]): Promise<void> => {
  const deletePromises = imageUrls.map(url => deleteFromCloudinary(url));
  await Promise.all(deletePromises);
};