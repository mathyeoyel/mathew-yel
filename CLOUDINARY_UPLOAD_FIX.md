# Cloudinary Upload Fix Guide

## Problem
Cloudinary upload is failing with an error about upload preset not being configured properly.

## Solution

### Step 1: Configure Unsigned Upload Preset in Cloudinary

1. **Log in to your Cloudinary account** at https://cloudinary.com/console

2. **Navigate to Settings**
   - Click on the gear icon (Settings) in the top right

3. **Go to Upload tab**
   - In the Settings page, click on the "Upload" tab

4. **Add/Edit Upload Preset**
   - Scroll down to "Upload presets" section
   - Find the preset named `mathew-yel` OR create a new one

5. **Configure the preset as UNSIGNED**
   - Click on the preset name to edit it
   - **IMPORTANT**: Change "Signing Mode" to **"Unsigned"**
   - Set the folder to: `mathew-yel` (or leave blank to use dynamic folders)
   - Save the preset

### Step 2: Verify Environment Variables

Make sure these are set in your Vercel project:

```
CLOUDINARY_CLOUD_NAME=djbjifhal
CLOUDINARY_UPLOAD_PRESET=mathew-yel
```

**To check/update in Vercel:**
1. Go to your project on Vercel
2. Click Settings → Environment Variables
3. Verify both variables are present
4. If you make changes, redeploy your project

### Step 3: Test the Upload

1. Clear your browser cache or use incognito mode
2. Go to your admin panel: https://mathewyel.com/admin.html
3. Try uploading an image
4. Check browser console (F12) for detailed error messages

## Common Issues

### Issue 1: "Upload preset must be unsigned"
**Solution**: Follow Step 1 above to make the preset unsigned in Cloudinary

### Issue 2: "Upload preset not found"
**Solution**: 
- Create a new unsigned upload preset in Cloudinary
- Update `CLOUDINARY_UPLOAD_PRESET` environment variable in Vercel
- Redeploy

### Issue 3: "Cloudinary is not configured"
**Solution**:
- Verify `CLOUDINARY_CLOUD_NAME` is set in Vercel
- Check the API endpoint: https://mathewyel.com/api/cloudinary/config
- Should return: `{"configured":true,"cloudName":"djbjifhal","uploadPreset":"mathew-yel"}`

## Debugging Tips

Open browser console (F12) and look for these messages:
- `✓ Cloudinary configured successfully` - Config loaded
- `Opening Cloudinary widget with config:` - Widget initialized
- `Cloudinary widget event:` - Shows all upload events
- `Cloudinary upload success:` - Upload completed

## Alternative: Use Direct URL

If Cloudinary upload continues to fail, you can:
1. Upload images manually to Cloudinary dashboard
2. Copy the image URL
3. Paste it in "Option 2: Use Existing URL" field in admin panel
