# Cloudinary Setup Guide

To enable image upload functionality, you need to configure Cloudinary environment variables.

## Step 1: Create a Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. After signing up, you'll get your Cloud Name from the dashboard

## Step 2: Create an Upload Preset
1. In your Cloudinary dashboard, go to Settings > Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set the preset name (e.g., "alumni_uploads")
5. Set "Signing Mode" to "Unsigned" for client-side uploads
6. Save the preset

## Step 3: Configure Environment Variables
Create a `.env` file in your project root with the following variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here
```

Replace:
- `your_cloud_name_here` with your actual Cloudinary cloud name
- `your_upload_preset_name_here` with your upload preset name

## Step 4: Restart Development Server
After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Troubleshooting

### Common Issues:

1. **"VITE_CLOUDINARY_CLOUD_NAME is not configured"**
   - Make sure you created the `.env` file in the project root
   - Check that the variable names start with `VITE_`
   - Restart the development server after creating the file

2. **"Upload failed: 401 Unauthorized"**
   - Check that your upload preset is set to "Unsigned"
   - Verify the upload preset name is correct

3. **"Upload failed: 404 Not Found"**
   - Verify your cloud name is correct
   - Check that the upload preset exists

4. **File size errors**
   - The system limits uploads to 5MB
   - Compress your images if they're too large

### Debug Information:
The system now includes detailed console logging. Open your browser's developer tools (F12) and check the Console tab for upload information and error details. 