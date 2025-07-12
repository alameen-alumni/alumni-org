// Cloudinary upload helper function
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Check if environment variables are set
  if (!cloudName || cloudName === 'your_cloud_name') {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not configured. Please set up your Cloudinary environment variables.');
  }

  if (!uploadPreset || uploadPreset === 'your_upload_preset') {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not configured. Please set up your Cloudinary environment variables.');
  }

  console.log('Uploading to Cloudinary:', {
    cloudName,
    uploadPreset,
    fileName: file.name,
    fileSize: file.size
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

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
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
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