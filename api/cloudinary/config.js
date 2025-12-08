// API endpoint to provide Cloudinary configuration from environment variables
// This keeps sensitive configuration server-side while making it available to client

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Cloudinary config from environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'mathew-yel';
    
    if (!cloudName) {
      console.error('CLOUDINARY_CLOUD_NAME environment variable not set');
      return res.status(500).json({ 
        error: 'Cloudinary configuration not available',
        configured: false
      });
    }

    return res.status(200).json({ 
      configured: true,
      cloudName: cloudName,
      uploadPreset: uploadPreset
    });

  } catch (error) {
    console.error('Cloudinary config error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      configured: false
    });
  }
};
