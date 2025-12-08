# Admin Panel Security Setup Guide

## Overview
This guide covers the comprehensive security improvements implemented for the Mathew Yel website admin panel and how to properly deploy them.

## New Security Enhancements (Updated)

### 1. Enhanced Authentication System (`auth.js`)
- **Password-based login** with session management
- **Device fingerprinting** - tracks device characteristics to prevent session hijacking
- **Session timeout** (2 hours)
- **Inactivity timeout** (10 minutes) - auto-logout on inactivity
- **Failed attempt protection** (3 attempts, 15-minute lockout)
- **Auto-logout** on session expiry
- **SHA-256 password hashing**
- **Session token refresh** every 5 minutes
- **HTTPS enforcement check**
- **Comprehensive audit logging**

### 2. Audit Logging System
- **Activity tracking** - logs all admin actions with timestamps
- **Security event logging** - tracks login attempts, failures, lockouts
- **Up to 50 audit entries** stored locally for quick review
- **Easy export** - download audit logs for compliance
- **Device fingerprint tracking** - records device characteristics
- **Timestamp verification** - all events timestamped with ISO format

### 3. Activity Monitoring
- **Real-time inactivity detection** - auto-logout after 10 minutes
- **Session refresh** - automatic token refresh every 5 minutes
- **Activity tracking** - monitors clicks, key presses, mouse movement, scrolling
- **Security checks** - runs at login and periodically during session

### 4. Device Fingerprinting (`auth.js`)
- **Device consistency verification** - ensures session is used on same device
- **Tracks** - user agent, language, timezone, screen resolution, color depth
- **Prevents** - session hijacking and unauthorized device access
- **Optional** - can be disabled in config if needed

### 5. CSRF Protection (`csrf.js`)
- **CSRF tokens** for all form submissions
- **Automatic token injection** into fetch requests
- **Token validation** on server-side
- **Token refresh** after successful operations
- **Header injection** for AJAX requests

## Deployment Setup

### Environment Variables (Required)
Set these in your Vercel dashboard under Settings > Environment Variables:

```
ADMIN_PASSWORD_HASH=your_sha256_password_hash_here
GITHUB_TOKEN=your_personal_access_token_here
GITHUB_OWNER=mathyeoyel
GITHUB_REPO=mathew-yel
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_UPLOAD_PRESET=mathew-yel
```

**See [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for detailed setup instructions.**

### Generating Admin Password Hash
1. **Choose a strong password** (12+ characters with uppercase, lowercase, numbers, symbols)

2. **Generate SHA-256 hash** of your password:
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').createHash('sha256').update('your_password').digest('hex'))"
   
   # Using PowerShell
   $password = "your_password"
   $bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
   $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
   [System.BitConverter]::ToString($hash).Replace('-','').ToLower()
   
   # Using online tool (less secure)
   # Visit: https://emn178.github.io/online-tools/sha256.html
   ```

3. **Set in Vercel Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `ADMIN_PASSWORD_HASH` with your generated hash
   - Select all environments (Production, Preview, Development)
   - Save and redeploy

4. **Important**: The admin panel now validates passwords via a secure server-side API endpoint (`/api/auth/validate`), so the password hash is NEVER exposed in client-side code.

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

### 1. Using Audit Logs
- **Access audit logs** - stored in browser's localStorage
- **Export logs** - use `adminAuth.exportAuditLogs()` in console
- **Review patterns** - check for suspicious activities
- **Monitor devices** - device fingerprints help identify unauthorized access
- **Verify timestamps** - all logs include ISO timestamps

### 2. Device Fingerprinting
- **Automatic tracking** - device info collected on login
- **Security check** - validates device on each session access
- **Change detection** - alerts if accessing from different device
- **Privacy respect** - uses public device characteristics only

### 3. Inactivity Protection
- **10-minute timeout** - auto-logout on inactivity
- **Activity tracking** - clicks, key presses, mouse movement register
- **Automatic refresh** - session refreshed automatically every 5 minutes
- **User notification** - clear message on auto-logout

### 4. API Security Best Practices
- **Rate limiting** - 50 requests per 15 minutes per IP
- **Request logging** - all API calls logged with IP address
- **Status tracking** - success/failure/error logged for each call
- **Validation strict** - all input validated and sanitized

### 5. Network Security
- Use HTTPS for all admin access
- Consider VPN for additional protection
- Implement IP allowlisting if needed (future feature)
- Monitor for unusual traffic patterns

### 6. Backup Strategy
- Regular automated backups
- Test restoration procedures
- Store backups securely
- Separate backup storage from production

### 7. Monitoring & Alerts
- Set up uptime monitoring
- Review audit logs regularly (weekly recommended)
- Monitor for unusual activity patterns
- Enable browser notifications for security events

## New Security Configuration File

### `security-config.js`
Contains centralized security settings:
- **Password requirements** - minimum length, complexity rules
- **Session timeouts** - configurable timeout periods
- **Rate limits** - API and login attempt limits
- **Upload restrictions** - file size and type limits
- **IP whitelist** - optional IP-based access control
- **Suspicious activity detection** - identifies potential attacks

### Using Security Config
```javascript
// Check password strength
const result = window.securityConfig.validatePasswordStrength('password123');
console.log(result.isStrong, result.issues);

// Check IP whitelist
const allowed = window.securityConfig.isIPAllowed('192.168.1.1');

// Get security recommendations
const recommendations = window.securityConfig.getSecurityRecommendations();
```

## Viewing Audit Logs

### In Browser Console
```javascript
// Get all audit logs
const logs = window.adminAuth.getAuditLogs();
console.table(logs);

// Export logs as JSON file
window.adminAuth.exportAuditLogs();

// Clear logs (be careful!)
window.adminAuth.clearAuditLogs();
```

### Example Log Entry
```json
{
  "timestamp": "2025-11-22T15:30:45.123Z",
  "action": "Successful login",
  "userAgent": "Mozilla/5.0...",
  "url": "https://example.com/admin.html",
  "details": {}
}
```

## Common Security Tasks

### Change Admin Password
1. Generate new SHA-256 hash of your password
2. Update `auth.js` line with new hash
3. Update environment variable `ADMIN_PASSWORD_HASH`
4. Redeploy to Vercel

### Review Security Events
1. Open admin panel in browser
2. Open developer console (F12)
3. Run: `console.table(adminAuth.getAuditLogs())`
4. Export logs with: `adminAuth.exportAuditLogs()`

### Enable IP Whitelisting
1. Edit `security-config.js`
2. Set `ipWhitelist` array with allowed IPs
3. Modify API to check IP whitelist
4. Redeploy changes

### Disable Device Fingerprinting (if needed)
1. Edit `auth.js` constructor
2. Set `this.enableDeviceFingerprint = false`
3. Restart browser and login again
4. Note: Less secure, not recommended

## Support

For security issues or questions:
1. Check browser console for security logs
2. Export and review audit logs
3. Check Vercel function logs
4. Review GitHub repository activity
5. Test with browser developer tools
6. Consult this security guide

## Security Checklist

Before deploying to production:
- [ ] Generate new admin password hash
- [ ] Set all environment variables in Vercel
- [ ] Enable HTTPS on custom domain
- [ ] Test login and audit logging
- [ ] Verify device fingerprinting works
- [ ] Test inactivity timeout
- [ ] Check audit log export functionality
- [ ] Review security recommendations
- [ ] Configure firewall/WAF rules
- [ ] Plan backup strategy
- [ ] Set up monitoring and alerts

Remember: Security is an ongoing process, not a one-time setup. Regularly review and update your security measures.