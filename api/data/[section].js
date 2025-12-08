// Serverless API endpoint for reading (and optionally updating) JSON data files.
// NOTE: Vercel serverless functions have an ephemeral filesystem. Runtime writes to local files
// do NOT persist between invocations. To support persistent edits from the admin panel in production,
// this function optionally commits changes back to the GitHub repository using the Contents API
// when the required environment variables are configured.
//
// Required env vars for write (POST) support:
//   GITHUB_TOKEN  -> A repo-scoped Personal Access Token with 'repo' (contents) permission
//   GITHUB_OWNER  -> Repository owner (user or org)
//   GITHUB_REPO   -> Repository name
//   ADMIN_PASSWORD_HASH -> SHA-256 hash of admin password for API security
// If these are missing, POST will return a 501 Not Implemented response with guidance.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Rate limiting store (in memory - resets on function restart)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 50; // Max 50 requests per window per IP

// Audit logging
const auditLogs = [];
const MAX_AUDIT_ENTRIES = 1000;

function logAudit(ip, method, section, action, status, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    ip: ip,
    method: method,
    section: section,
    action: action,
    status: status,
    userAgent: details.userAgent || 'unknown',
    details: details
  };
  
  auditLogs.push(entry);
  if (auditLogs.length > MAX_AUDIT_ENTRIES) {
    auditLogs.shift();
  }
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('📝 Audit:', entry);
  }
}

// Helper: safe JSON parse
function safeParse(jsonStr) {
  try { return JSON.parse(jsonStr); } catch { return null; }
}

// Helper: Rate limiting
function checkRateLimit(clientIP) {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  // Reset if window expired
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  clientData.count++;
  rateLimitStore.set(clientIP, clientData);
  
  return {
    allowed: clientData.count <= RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - clientData.count),
    resetTime: clientData.resetTime
  };
}

// Helper: Get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown';
}

// Helper: Validate CSRF token
function validateCSRFToken(req) {
  const token = req.headers['x-csrf-token'] || req.body?.csrf_token;
  
  if (!token) {
    return { valid: false, error: 'CSRF token missing' };
  }
  
  // Simple token validation (you can enhance this)
  if (typeof token !== 'string' || token.length !== 64) {
    return { valid: false, error: 'Invalid CSRF token format' };
  }
  
  return { valid: true };
}

// Helper: Validate admin authentication
function validateAdminAuth(req) {
  const authHeader = req.headers.authorization;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!adminPasswordHash) {
    return { valid: false, error: 'Admin authentication not configured' };
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }
  
  const providedHash = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (providedHash !== adminPasswordHash) {
    return { valid: false, error: 'Invalid admin credentials' };
  }
  
  return { valid: true };
}

// Helper: Input validation and sanitization
function validateAndSanitizeInput(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' };
  }
  
  // Convert to string and back to remove any potential code injection
  const jsonString = JSON.stringify(data);
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(jsonString)) {
      return { valid: false, error: 'Potentially malicious content detected' };
    }
  }
  
  // Additional size check
  if (jsonString.length > 10 * 1024 * 1024) { // 10MB limit
    return { valid: false, error: 'Data size exceeds limit' };
  }
  
  try {
    const sanitized = JSON.parse(jsonString);
    return { valid: true, data: sanitized };
  } catch {
    return { valid: false, error: 'Data parsing error' };
  }
}

// Helper: GitHub commit
async function commitToGitHub(section, dataObj) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!token || !owner || !repo) {
    return { ok: false, reason: 'GitHub environment variables not fully configured' };
  }

  const filePath = `data/${section}.json`;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // 1. Get current file to retrieve SHA (if it exists)
  let sha = undefined;
  const getResp = await fetch(apiBase, { 
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'mathew-yel-admin/1.0'
    } 
  });
  
  if (getResp.status === 200) {
    const current = await getResp.json();
    sha = current.sha;
  } else if (getResp.status !== 404) {
    const text = await getResp.text();
    return { ok: false, reason: `Failed to read existing file: ${getResp.status} ${text}` };
  }

  const newContent = Buffer.from(JSON.stringify(dataObj, null, 2), 'utf8').toString('base64');
  const message = `chore: update ${filePath} via admin panel [${new Date().toISOString()}]`;

  const putResp = await fetch(apiBase, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'mathew-yel-admin/1.0'
    },
    body: JSON.stringify({ message, content: newContent, sha })
  });

  if (!putResp.ok) {
    const text = await putResp.text();
    return { ok: false, reason: `GitHub commit failed: ${putResp.status} ${text}` };
  }
  return { ok: true };
}

module.exports = async function handler(req, res) {
  // Get client IP for rate limiting
  const clientIP = getClientIP(req);
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS (more restrictive in production)
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.VERCEL_URL, process.env.CUSTOM_DOMAIN].filter(Boolean)
    : ['*'];
    
  const origin = req.headers.origin;
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rate limiting
  const rateLimit = checkRateLimit(clientIP);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
  
  if (!rateLimit.allowed) {
    res.status(429).json({ 
      error: 'Too many requests',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
    return;
  }

  const { section } = req.query;
  if (!section) {
    res.status(400).json({ error: 'Section parameter is required' });
    return;
  }

  // Validate section name to prevent path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(section)) {
    res.status(400).json({ error: 'Invalid section name' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const clientIP = getClientIP(req);
      const filePath = path.join(process.cwd(), 'data', `${section}.json`);
      
      // Ensure we're only accessing files within the data directory
      const resolvedPath = path.resolve(filePath);
      const dataDir = path.resolve(path.join(process.cwd(), 'data'));
      
      if (!resolvedPath.startsWith(dataDir)) {
        logAudit(clientIP, 'GET', section, 'read', 'BLOCKED', { reason: 'Path traversal attempt' });
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      
      if (!fs.existsSync(resolvedPath)) {
        logAudit(clientIP, 'GET', section, 'read', 'NOT_FOUND');
        res.status(404).json({ error: 'File not found' });
        return;
      }
      
      const fileContent = fs.readFileSync(resolvedPath, 'utf8');
      const data = safeParse(fileContent);
      if (data === null) {
        logAudit(clientIP, 'GET', section, 'read', 'ERROR', { reason: 'Invalid JSON format' });
        res.status(500).json({ error: 'Invalid JSON format in data file' });
        return;
      }
      
      logAudit(clientIP, 'GET', section, 'read', 'SUCCESS');
      res.status(200).json(data);
    } catch (err) {
      const clientIP = getClientIP(req);
      logAudit(clientIP, 'GET', section, 'read', 'ERROR', { error: err.message });
      console.error('GET read error:', err);
      res.status(500).json({ error: 'Failed to read data file' });
    }
  } else if (req.method === 'POST') {
    const clientIP = getClientIP(req);
    
    try {
      // Check admin authentication
      const authResult = validateAdminAuth(req);
      if (!authResult.valid) {
        logAudit(clientIP, 'POST', section, 'write', 'UNAUTHORIZED', { reason: authResult.error });
        res.status(401).json({ error: 'Unauthorized', details: authResult.error });
        return;
      }
      
      // Check CSRF token
      const csrfResult = validateCSRFToken(req);
      if (!csrfResult.valid) {
        logAudit(clientIP, 'POST', section, 'write', 'CSRF_FAILED', { reason: csrfResult.error });
        res.status(403).json({ error: 'CSRF validation failed', details: csrfResult.error });
        return;
      }

      const body = req.body || {};
      const newData = body.data;
      if (typeof newData === 'undefined') {
        logAudit(clientIP, 'POST', section, 'write', 'BAD_REQUEST', { reason: 'Missing data' });
        res.status(400).json({ error: 'Missing data in request body' });
        return;
      }

      // Validate and sanitize input
      const validation = validateAndSanitizeInput(newData);
      if (!validation.valid) {
        logAudit(clientIP, 'POST', section, 'write', 'VALIDATION_FAILED', { reason: validation.error });
        res.status(400).json({ error: 'Invalid input data', details: validation.error });
        return;
      }

      // Attempt commit to GitHub for persistence
      const commitResult = await commitToGitHub(section, validation.data);
      if (!commitResult.ok) {
        logAudit(clientIP, 'POST', section, 'write', 'GITHUB_ERROR', { reason: commitResult.reason });
        res.status(501).json({
          error: 'Persistence not configured',
          details: commitResult.reason,
          hint: 'Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, and ADMIN_PASSWORD_HASH in Vercel project settings to enable saving.'
        });
        return;
      }

      logAudit(clientIP, 'POST', section, 'write', 'SUCCESS');
      res.status(200).json({ success: true, message: 'Data committed to repository' });
    } catch (err) {
      logAudit(clientIP, 'POST', section, 'write', 'ERROR', { error: err.message });
      console.error('POST write error:', err);
      res.status(500).json({ error: 'Failed to update data file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};