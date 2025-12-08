// API endpoint to validate admin password hash
// This allows the client to check password without exposing the hash in client-side code

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { passwordHash } = req.body;
    
    // Validate input
    if (!passwordHash || typeof passwordHash !== 'string') {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid request format' 
      });
    }

    // Get the correct password hash from environment variable
    const correctHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (!correctHash) {
      console.error('ADMIN_PASSWORD_HASH environment variable not set');
      return res.status(500).json({ 
        valid: false, 
        error: 'Server configuration error' 
      });
    }

    // Compare hashes
    const isValid = passwordHash === correctHash;
    
    // Log attempt (for security monitoring)
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                    req.headers['x-real-ip'] || 
                    'unknown';
    
    console.log(`Password validation attempt from ${clientIP}: ${isValid ? 'SUCCESS' : 'FAILURE'}`);

    return res.status(200).json({ 
      valid: isValid,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Password validation error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
};
