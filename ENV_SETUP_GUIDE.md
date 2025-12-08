# Environment Variables Setup Guide

## Required Environment Variables for Vercel Deployment

This guide explains how to set up all required environment variables in your Vercel project dashboard.

---

## 🔐 Required Variables

### 1. **ADMIN_PASSWORD_HASH**
**Purpose:** Secure password authentication for admin panel access

**How to generate:**
1. Choose a strong password (12+ characters, mix of uppercase, lowercase, numbers, and symbols)
2. Generate SHA-256 hash:

**Option A - Using Node.js (Recommended):**
```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD_HERE').digest('hex'))"
```

**Option B - Using PowerShell:**
```powershell
$password = "YOUR_PASSWORD_HERE"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
$hashString = [System.BitConverter]::ToString($hash).Replace('-','').ToLower()
Write-Output $hashString
```

**Option C - Using Online Tool (Less Secure):**
Visit: https://emn178.github.io/online-tools/sha256.html

**Example:**
```
Password: MySecurePassword123!
Hash: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
```

**Set in Vercel:**
```
Key: ADMIN_PASSWORD_HASH
Value: [your generated hash]
Environment: Production, Preview, Development
```

---

### 2. **CLOUDINARY_CLOUD_NAME**
**Purpose:** Your Cloudinary cloud name for image uploads

**Where to find:**
1. Login to Cloudinary: https://console.cloudinary.com/
2. Go to Dashboard (Home)
3. Find "Cloud Name" in the Account Details section

**Example:**
```
Cloud Name: djbjifhal
```

**Set in Vercel:**
```
Key: CLOUDINARY_CLOUD_NAME
Value: djbjifhal
Environment: Production, Preview, Development
```

---

### 3. **CLOUDINARY_UPLOAD_PRESET** (Optional)
**Purpose:** Unsigned upload preset name for Cloudinary uploads
**Default Value:** `mathew-yel` (if not set)

**How to create:**
1. Login to Cloudinary: https://console.cloudinary.com/
2. Go to Settings → Upload → Upload presets
3. Click "Add upload preset"
4. Configure:
   - Preset name: `mathew-yel` (or your choice)
   - Signing mode: **Unsigned** ✓ (IMPORTANT!)
   - Folder: (leave empty)
   - Use filename: Yes
   - Unique filename: Yes
5. Save

**Set in Vercel:**
```
Key: CLOUDINARY_UPLOAD_PRESET
Value: mathew-yel
Environment: Production, Preview, Development
```

---

### 4. **GITHUB_TOKEN**
**Purpose:** Personal Access Token for updating JSON data files via GitHub API

**How to generate:**
1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Configure:
   - Note: `Mathew Yel Admin Panel`
   - Expiration: `No expiration` (or set your preference)
   - Scopes: Check `repo` (Full control of private repositories)
4. Click "Generate token"
5. **IMPORTANT:** Copy the token immediately (you won't see it again!)

**Set in Vercel:**
```
Key: GITHUB_TOKEN
Value: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environment: Production, Preview, Development
```

---

### 5. **GITHUB_OWNER**
**Purpose:** GitHub username or organization name

**Value:** `mathyeoyel` (your GitHub username)

**Set in Vercel:**
```
Key: GITHUB_OWNER
Value: mathyeoyel
Environment: Production, Preview, Development
```

---

### 6. **GITHUB_REPO**
**Purpose:** GitHub repository name

**Value:** `mathew-yel` (your repository name)

**Set in Vercel:**
```
Key: GITHUB_REPO
Value: mathew-yel
Environment: Production, Preview, Development
```

---

## 📋 Quick Setup Checklist

- [ ] Generated strong admin password
- [ ] Created SHA-256 hash of admin password
- [ ] Set `ADMIN_PASSWORD_HASH` in Vercel
- [ ] Found Cloudinary cloud name
- [ ] Set `CLOUDINARY_CLOUD_NAME` in Vercel
- [ ] Created Cloudinary upload preset (unsigned)
- [ ] Set `CLOUDINARY_UPLOAD_PRESET` in Vercel (optional)
- [ ] Generated GitHub Personal Access Token
- [ ] Set `GITHUB_TOKEN` in Vercel
- [ ] Set `GITHUB_OWNER` in Vercel
- [ ] Set `GITHUB_REPO` in Vercel
- [ ] Redeployed Vercel project

---

## 🚀 How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard
1. Go to your Vercel project: https://vercel.com/mathyeoyel/mathew-yel
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. For each variable:
   - Enter the **Key** (variable name)
   - Enter the **Value** (variable value)
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**

### Method 2: Via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add ADMIN_PASSWORD_HASH production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_UPLOAD_PRESET production
vercel env add GITHUB_TOKEN production
vercel env add GITHUB_OWNER production
vercel env add GITHUB_REPO production
```

---

## 🔄 After Setting Variables

**IMPORTANT:** After adding or updating environment variables, you must redeploy:

### Via Vercel Dashboard:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **•••** (three dots)
4. Click **Redeploy**

### Via Vercel CLI:
```bash
vercel --prod
```

---

## ✅ Testing Your Setup

### 1. Test Admin Login
1. Visit: https://mathewyel.com/admin.html
2. Enter your password (the one you created the hash for)
3. Should login successfully

### 2. Test Cloudinary Upload
1. Login to admin panel
2. Go to Projects or Blogs section
3. Click "Upload to Cloudinary" button
4. Upload widget should open
5. Upload an image
6. Image URL should populate in the form

### 3. Test Data Updates
1. Login to admin panel
2. Add or edit a project
3. Click Save
4. Check GitHub repository for new commit
5. Check website to see changes live

---

## 🔒 Security Best Practices

### Password Security
- ✅ Use a password manager to generate strong passwords
- ✅ Never share your password hash in public repositories
- ✅ Change password regularly (every 3-6 months)
- ✅ Use different passwords for different services

### Token Security
- ✅ Never commit tokens to Git
- ✅ Set token expiration dates when possible
- ✅ Regularly rotate GitHub tokens
- ✅ Monitor GitHub for unauthorized access
- ✅ Use principle of least privilege (minimum required scopes)

### Environment Variables
- ✅ Only set in Vercel dashboard, never in code
- ✅ Use encrypted environment variables feature
- ✅ Regularly audit which variables are set
- ✅ Remove unused variables

---

## 🐛 Troubleshooting

### Issue: Admin login fails with correct password
**Solution:**
1. Verify `ADMIN_PASSWORD_HASH` is set correctly in Vercel
2. Regenerate the hash and update in Vercel
3. Redeploy the project
4. Clear browser cache and try again

### Issue: Cloudinary upload button doesn't work
**Solution:**
1. Check browser console for errors
2. Verify `CLOUDINARY_CLOUD_NAME` is set in Vercel
3. Verify upload preset exists and is **unsigned**
4. Check CSP headers allow Cloudinary domains
5. Redeploy and test again

### Issue: Data updates don't persist
**Solution:**
1. Check `GITHUB_TOKEN` has correct permissions (`repo` scope)
2. Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
3. Check Vercel function logs for error messages
4. Ensure token hasn't expired
5. Test token with GitHub API directly

### Issue: "Configuration not available" error
**Solution:**
1. Confirm all required env variables are set
2. Check they're set for the correct environment
3. Redeploy after setting variables
4. Wait 1-2 minutes for deployment to complete
5. Hard refresh browser (Ctrl+Shift+R)

---

## 📞 Support

If you encounter issues:
1. Check Vercel function logs: Vercel Dashboard → Deployments → [Latest] → Functions
2. Check browser console: F12 → Console tab
3. Verify all environment variables are set correctly
4. Try redeploying the project
5. Clear browser cache and cookies

---

## 📚 Related Documentation

- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - Comprehensive security setup
- [CLOUDINARY_SETUP_COMPLETE.md](./CLOUDINARY_SETUP_COMPLETE.md) - Cloudinary configuration
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions

---

**Last Updated:** December 8, 2025
