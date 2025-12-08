## Admin Panel - Security Quick Reference

### 🔐 Access Admin Panel
- URL: `https://yourdomain.com/admin.html`
- Use strong password (12+ chars, mixed case, numbers, symbols)
- Auto-logout after 10 minutes of inactivity

### 📝 View Audit Logs

**In Browser Console (Press F12):**
```javascript
// View all logs
adminAuth.getAuditLogs()

// View logs in table format
console.table(adminAuth.getAuditLogs())

// Export to JSON file
adminAuth.exportAuditLogs()

// Clear old logs
adminAuth.clearAuditLogs()
```

### 🛡️ Security Features

| Feature | Status | Notes |
|---------|--------|-------|
| HTTPS Only | ✅ Required | Enforced in production |
| Device Fingerprinting | ✅ Active | Prevents session hijacking |
| Session Timeout | ✅ 2 hours | Auto-logout |
| Inactivity Timeout | ✅ 10 minutes | Auto-logout when idle |
| Login Attempts | ✅ Limited | 3 attempts max |
| CSRF Protection | ✅ Active | All requests protected |
| Input Validation | ✅ Active | XSS prevention |
| Rate Limiting | ✅ 50/15min | Per IP address |
| Audit Logging | ✅ 50 entries | Automatic tracking |
| Password Hashing | ✅ SHA-256 | Server-side validation |

### 🔑 Password Requirements

- **Minimum Length:** 12 characters
- **Must Include:** Uppercase letters
- **Must Include:** Numbers (0-9)
- **Must Include:** Symbols (!@#$%^&*)

**Example Strong Password:**
- ✅ `MyAdmin@Password123`
- ✅ `SecureAdmin#2025`
- ❌ `admin123` (too simple)
- ❌ `password` (too simple)

### 🚨 Security Alerts

**What to watch for:**
- Multiple failed login attempts
- Login from unexpected device
- Unusual access patterns
- API calls outside normal usage

**If suspicious activity detected:**
1. Immediately change admin password
2. Review audit logs
3. Check for unauthorized changes
4. Rotate GitHub token
5. Contact security team

### ⚙️ Configuration

**File:** `security-config.js`

```javascript
// Password requirements
passwordMinLength: 12
passwordRequireUppercase: true
passwordRequireNumbers: true
passwordRequireSymbols: true

// Session settings
sessionTimeout: 2 hours
inactivityTimeout: 10 minutes
sessionRefreshInterval: 5 minutes

// Rate limiting
maxLoginAttempts: 3
loginLockoutDuration: 15 minutes
apiRateLimit: 50 requests per 15 minutes

// Security features
enableHTTPSOnly: true
enableDeviceFingerprinting: true
enableAuditLogging: true
enableInputValidation: true
enableCSRFProtection: true
```

### 📋 Audit Log Entry Format

```json
{
  "timestamp": "2025-11-22T15:30:45.123Z",
  "action": "Successful login",
  "userAgent": "Mozilla/5.0...",
  "url": "https://example.com/admin.html",
  "details": {
    "device": "fingerprint_hash"
  }
}
```

### 🔄 Session Management

**Session Auto-Refresh:**
- Token refreshed every 5 minutes automatically
- No action needed from user
- Extends session as long as active

**Activity Detection:**
- Click detection
- Keyboard input detection
- Mouse movement detection
- Scroll detection
- 10 minutes of no activity = logout

### 🌍 API Rate Limits

- **Limit:** 50 requests per IP
- **Window:** 15 minutes
- **Response:** 429 Too Many Requests

### 📊 Monitoring Recommended

**Weekly:**
- Review audit logs for anomalies
- Check for failed login attempts
- Verify no unauthorized changes

**Monthly:**
- Rotate admin password
- Update security credentials
- Review access patterns

**Quarterly:**
- Full security audit
- Backup verification
- Policy review

### 🆘 Troubleshooting

**Q: Stuck at login?**
- A: Check Caps Lock, verify password, clear browser cache

**Q: Session keeps expiring?**
- A: Inactivity detected (10 min no activity), move mouse/click

**Q: Device fingerprint mismatch?**
- A: Accessing from different browser/device, login again

**Q: Can't export logs?**
- A: Check browser console, ensure localStorage enabled

**Q: Too many login attempts?**
- A: Wait 15 minutes or contact admin

### 📞 Support

**For security issues:**
1. Check `SECURITY_GUIDE.md`
2. Review `SECURITY_ENHANCEMENTS.md`
3. Check browser console logs
4. Export and review audit logs
5. Contact system administrator

### ✅ Security Checklist

Before each session:
- [ ] Using HTTPS (not HTTP)
- [ ] On trusted device
- [ ] On trusted network
- [ ] No shoulder surfers
- [ ] Screen privacy ensured
- [ ] Other users logged out

After each session:
- [ ] Click logout button
- [ ] Closed all admin tabs
- [ ] Cleared sensitive data if shared device
- [ ] Locked computer

### 🔓 Emergency Lockout Recovery

**If locked out (3 failed attempts):**
1. Wait 15 minutes for lockout to expire
2. Or contact administrator to reset
3. Or clear localStorage if local development

**To reset:**
```javascript
// In console (dev only)
localStorage.removeItem('login_attempts')
localStorage.removeItem('admin_session')
```

### 📚 Documentation

- `SECURITY_GUIDE.md` - Complete security guide
- `SECURITY_ENHANCEMENTS.md` - Feature summary
- `auth.js` - Authentication code
- `security-config.js` - Configuration options

---

**Last Updated:** November 22, 2025
**Status:** Active & Monitored ✅
