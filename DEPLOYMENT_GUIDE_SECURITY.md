# Deployment Guide - Security Enhancements

## Pre-Deployment Checklist

### Code Review
- [ ] Review all changes in `auth.js`
- [ ] Review changes in `api/data/[section].js`
- [ ] Review new `security-config.js` file
- [ ] Review CSP headers in `admin.html`
- [ ] Test audit logging locally
- [ ] Test device fingerprinting
- [ ] Test inactivity timeout

### Environment Setup
- [ ] Vercel project ready
- [ ] GitHub token available
- [ ] Admin password hash generated
- [ ] Environment variables prepared
- [ ] Repository configured

## Step 1: Generate New Admin Password

```bash
# Generate SHA-256 hash of your new admin password
node -e "console.log(require('crypto').createHash('sha256').update('YourSecurePassword123!').digest('hex'))"
```

Save this hash - you'll need it for the next steps.

## Step 2: Update Local Files

### 2a. Update auth.js with new password hash

In `auth.js`, find line with `this.correctPasswordHash =` and update:

```javascript
this.correctPasswordHash = 'YOUR_NEW_SHA256_HASH_HERE';
```

### 2b. Verify all files are present

```bash
# Check all security files exist
ls auth.js csrf.js validation.js security-config.js admin.html
ls api/data/[section].js
```

### 2c. Verify documentation

```bash
# Check all documentation files
ls SECURITY_GUIDE.md SECURITY_ENHANCEMENTS.md SECURITY_QUICK_REFERENCE.md IMPLEMENTATION_SUMMARY.md SECURITY_TESTING.md
```

## Step 3: Set Environment Variables in Vercel

Go to **Vercel Dashboard** > **Project Settings** > **Environment Variables**

Add these variables:

```
GITHUB_TOKEN: [Your GitHub personal access token with 'repo' scope]
GITHUB_OWNER: mathyeoyel
GITHUB_REPO: mathew-yel
ADMIN_PASSWORD_HASH: [Your new SHA-256 hash]
NODE_ENV: production
```

## Step 4: Commit and Deploy

### Local Testing First

```bash
# Test locally first
npm start
# or
vercel dev
```

Open admin panel and test:
- Login with new password
- Check audit logs in console
- Test device fingerprinting
- Wait 10 minutes to test inactivity timeout

### Commit Changes

```bash
git add .
git commit -m "chore: enhance admin panel security

- Add device fingerprinting
- Implement comprehensive audit logging
- Add activity monitoring with inactivity timeout
- Enhance API security with detailed logging
- Add security configuration file
- Update security documentation"

git push origin main
```

### Deploy to Vercel

```bash
# Deploy
vercel deploy --prod

# Or use Vercel dashboard - automatic on push if configured
```

## Step 5: Post-Deployment Verification

### 5a. Test in Production

1. Go to production URL: `https://yourdomain.com/admin.html`
2. Log in with new password
3. Verify you're logged in successfully

### 5b. Check Audit Logs

```javascript
// In browser console (F12)
adminAuth.getAuditLogs()
```

Should show successful login entry.

### 5c. Test Security Features

**Device Fingerprinting:**
```javascript
console.log(adminAuth.deviceFingerprint)
```

**Export Audit Logs:**
```javascript
adminAuth.exportAuditLogs()
// Should download JSON file
```

**Check Configuration:**
```javascript
window.securityConfig.config
```

### 5d. Monitor Vercel Logs

```bash
# View production logs
vercel logs
```

Look for any errors or warnings.

## Rollback Plan

If issues occur after deployment:

### Quick Rollback

```bash
# Revert to previous deployment
vercel rollback
# or
git revert <commit-hash>
git push origin main
```

### Keep Previous Password Hash

Store the old password hash in a secure location in case you need to revert:

```bash
# If needed, update Vercel environment variables
vercel env pull .env.production
# Edit ADMIN_PASSWORD_HASH if needed
vercel env push .env.production
```

## Post-Deployment Tasks

### Day 1
- [ ] Monitor access logs for errors
- [ ] Test from multiple devices
- [ ] Verify all security features working
- [ ] Check console for any warnings

### Week 1
- [ ] Review audit logs for suspicious activity
- [ ] Test different browser combinations
- [ ] Verify rate limiting works
- [ ] Test API functionality

### Month 1
- [ ] Full security audit
- [ ] Performance monitoring
- [ ] Backup verification
- [ ] Access log review

## Security Settings Recommendation

### Recommended Configuration

**auth.js:**
```javascript
// Already configured optimally for most use cases
sessionTimeout: 2 * 60 * 60 * 1000 // 2 hours
inactivityTimeout: 10 * 60 * 1000 // 10 minutes
```

**security-config.js:**
```javascript
// For maximum security (recommended for production)
passwordMinLength: 12
passwordRequireUppercase: true
passwordRequireNumbers: true
passwordRequireSymbols: true
enableDeviceFingerprinting: true
enableAuditLogging: true
```

### Optional Configurations

**IP Whitelisting (if needed):**

In `security-config.js`:
```javascript
ipWhitelist: [
  '192.168.1.1',   // Your office IP
  '203.0.113.5'    // Your home IP
]
```

**Extended Timeouts (if needed):**

In `security-config.js`:
```javascript
sessionTimeout: 4 * 60 * 60 * 1000 // 4 hours
inactivityTimeout: 30 * 60 * 1000 // 30 minutes
```

## Monitoring Setup (Optional but Recommended)

### Enable Admin Panel Monitoring

Add to your monitoring service:

```javascript
// Log to external service
const logToService = (event) => {
  fetch('https://your-monitoring.com/logs', {
    method: 'POST',
    body: JSON.stringify(event)
  });
};
```

### Set Up Alerts

Monitor for:
- Multiple failed login attempts
- API errors
- Rate limit hits
- Unusual device fingerprints

## Troubleshooting Deployment Issues

### Issue: Password not working

**Solution:**
1. Verify SHA-256 hash is correct
2. Check environment variable is set in Vercel
3. Redeploy after updating

### Issue: Audit logs not showing

**Solution:**
1. Check browser console for errors
2. Ensure localStorage is enabled
3. Try exporting logs to verify functionality

### Issue: Device fingerprint issues

**Solution:**
1. Clear browser cache
2. Try different browser
3. Disable fingerprinting in config if needed

### Issue: Rate limiting too strict

**Solution:**
1. Adjust rate limit in config
2. Check if behind proxy/VPN
3. Contact Vercel support for IP issues

## Post-Deployment Documentation

### Update Your Team

Share with team:
- `SECURITY_QUICK_REFERENCE.md` - Daily usage guide
- `SECURITY_GUIDE.md` - Complete reference
- Login credentials (securely)
- Emergency procedures

### Team Training Points

Ensure team knows:
1. How to log in securely
2. How to access audit logs
3. Password requirements
4. Auto-logout features
5. What to do if locked out
6. How to report security issues

## Maintenance Schedule

### Weekly
- [ ] Review audit logs
- [ ] Check for failed login attempts
- [ ] Monitor API usage

### Monthly
- [ ] Full security audit
- [ ] Performance review
- [ ] Backup verification
- [ ] Access pattern analysis

### Quarterly
- [ ] Update security documentation
- [ ] Review password policies
- [ ] Test disaster recovery
- [ ] Security training refresh

### Annually
- [ ] Full penetration testing
- [ ] Policy review and updates
- [ ] System upgrade planning
- [ ] Compliance verification

## Support Resources

**Documentation:**
- `SECURITY_GUIDE.md` - Complete setup guide
- `SECURITY_ENHANCEMENTS.md` - Feature overview
- `SECURITY_QUICK_REFERENCE.md` - Quick help
- `SECURITY_TESTING.md` - Testing procedures
- `IMPLEMENTATION_SUMMARY.md` - What was changed

**Emergency Contacts:**
- Vercel Support: https://vercel.com/support
- GitHub Support: https://github.com/support
- Your Security Team: [contact info]

## Success Criteria

Deployment is successful when:

- ✅ Admin login works with new password
- ✅ Audit logs show login event
- ✅ Device fingerprinting activates
- ✅ No console errors on login
- ✅ Security features visible in F12 console
- ✅ Documentation accessible
- ✅ Team trained and ready
- ✅ Monitoring in place

## Final Sign-Off

**Deployed By:** _______________________
**Date:** _______________________
**Environment:** _______________________
**Version:** 1.0 - Enhanced Security

---

**Last Updated:** November 22, 2025
**Next Review:** 90 days after deployment
