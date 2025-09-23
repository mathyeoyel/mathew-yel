# Admin Panel Security Setup Guide

## Overview
This guide covers the security improvements implemented for the Mathew Yel website admin panel and how to properly deploy them.

## Security Features Implemented

### 1. Authentication System (`auth.js`)
- **Password-based login** with session management
- **Session timeout** (2 hours)
- **Failed attempt protection** (3 attempts, 15-minute lockout)
- **Auto-logout** on session expiry
- **SHA-256 password hashing**

### 2. CSRF Protection (`csrf.js`)
- **CSRF tokens** for all form submissions
- **Automatic token injection** into fetch requests
- **Token validation** on server-side
- **Token refresh** after successful operations

### 3. Input Validation & Sanitization (`validation.js`)
- **XSS protection** against script injection
- **Real-time validation** with visual feedback
- **Length limits** for all input fields
- **URL and email validation**
- **Content sanitization** before saving

### 4. API Security (Enhanced `api/data/[section].js`)
- **Rate limiting** (50 requests per 15 minutes per IP)
- **Authentication middleware** for write operations
- **CSRF validation** for state-changing requests
- **Input sanitization** and size limits
- **Path traversal protection**

### 5. Security Headers (`vercel.json`)
- **Content Security Policy** (CSP)
- **X-Frame-Options** (Clickjacking protection)
- **X-XSS-Protection** (XSS filtering)
- **X-Content-Type-Options** (MIME sniffing protection)
- **Strict Transport Security** (HTTPS enforcement)

### 6. File Upload Security
- **File type validation** (only images)
- **Size limits** (1MB max)
- **Dimension validation** (2048px max)
- **Filename sanitization**
- **Image compression** and optimization

## Deployment Setup

### Environment Variables (Required)
Set these in your Vercel dashboard under Settings > Environment Variables:

```
GITHUB_TOKEN=your_personal_access_token_here
GITHUB_OWNER=mathyeoyel
GITHUB_REPO=mathew-yel
ADMIN_PASSWORD_HASH=your_sha256_password_hash_here
```

### Generating Admin Password Hash
1. **Change the default password** in `auth.js` (line 15):
   ```javascript
   this.correctPasswordHash = 'your_new_hash_here';
   ```

2. **Generate SHA-256 hash** of your password:
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').createHash('sha256').update('your_password').digest('hex'))"
   
   # Using online tool (less secure)
   # Visit: https://emn178.github.io/online-tools/sha256.html
   ```

3. **Update both locations**:
   - Replace hash in `auth.js`
   - Set `ADMIN_PASSWORD_HASH` environment variable

### GitHub Token Setup
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with `repo` scope
3. Copy token and set as `GITHUB_TOKEN` environment variable

## Security Best Practices

### 1. Password Security
- Use a strong, unique password (12+ characters)
- Include uppercase, lowercase, numbers, and symbols
- Don't share the password or store it in plain text
- Change password regularly

### 2. Environment Variables
- Never commit sensitive environment variables to git
- Use Vercel's encrypted environment variables
- Regularly rotate API tokens and passwords

### 3. Access Control
- Only access admin panel from trusted devices/networks
- Always logout when finished
- Monitor for suspicious login attempts

### 4. Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Review access logs periodically

## File Structure
```
mathew-yel/
├── admin.html          # Secure admin interface
├── auth.js            # Authentication system
├── csrf.js            # CSRF protection
├── validation.js      # Input validation
├── api/
│   └── data/
│       └── [section].js # Secured API endpoint
├── vercel.json        # Security headers
└── SECURITY_GUIDE.md  # This file
```

## Testing Security

### 1. Authentication Test
- Try accessing `/admin.html` without login
- Test with wrong password (should lockout after 3 attempts)
- Test session timeout (should auto-logout after 2 hours)

### 2. CSRF Test
- Try making API calls without CSRF token
- Should receive 403 Forbidden response

### 3. Input Validation Test
- Try entering script tags in form fields
- Try uploading non-image files
- Try entering overly long content

### 4. Rate Limiting Test
- Make rapid API requests (should limit after 50 requests)

## Security Monitoring

### 1. Access Logs
- Monitor Vercel function logs for:
  - Failed authentication attempts
  - Rate limit triggers
  - Suspicious input patterns

### 2. GitHub Repository
- Check commit history for unauthorized changes
- Enable branch protection rules
- Set up notification for repository access

### 3. Regular Audits
- Review admin panel access patterns
- Check for new security vulnerabilities
- Update passwords and tokens regularly

## Incident Response

### If Unauthorized Access Suspected:
1. **Immediately change admin password**
2. **Rotate GitHub token**
3. **Check repository commit history**
4. **Review Vercel access logs**
5. **Update environment variables**

### If Data Compromise Detected:
1. **Backup current data**
2. **Restore from known good state**
3. **Investigate compromise vector**
4. **Implement additional security measures**

## Additional Security Recommendations

### 1. Network Security
- Use HTTPS for all admin access
- Consider VPN for additional protection
- Implement IP allowlisting if needed

### 2. Backup Strategy
- Regular automated backups
- Test restoration procedures
- Store backups securely

### 3. Monitoring
- Set up uptime monitoring
- Monitor for unusual traffic patterns
- Log security events for analysis

## Support

For security issues or questions:
1. Check Vercel function logs
2. Review GitHub repository activity
3. Test with browser developer tools
4. Consult this security guide

Remember: Security is an ongoing process, not a one-time setup. Regularly review and update your security measures.