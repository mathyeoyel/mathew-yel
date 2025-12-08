/**
 * Enhanced Security Configuration
 * Provides additional security features and best practices for the admin panel
 */

class SecurityConfig {
  constructor() {
    this.config = {
      // Authentication
      passwordMinLength: 12,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: true,
      
      // Session
      sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours
      inactivityTimeout: 10 * 60 * 1000, // 10 minutes
      sessionRefreshInterval: 5 * 60 * 1000, // 5 minutes
      
      // Rate Limiting
      maxLoginAttempts: 3,
      loginLockoutDuration: 15 * 60 * 1000, // 15 minutes
      apiRateLimit: 50, // requests per window
      apiRateLimitWindow: 15 * 60 * 1000, // 15 minutes
      
      // Security Features
      enableHTTPSOnly: true,
      enableDeviceFingerprinting: true,
      enableAuditLogging: true,
      enableInputValidation: true,
      enableCSRFProtection: true,
      enableContentSecurityPolicy: true,
      
      // Data Protection
      maxUploadSize: 1 * 1024 * 1024, // 1MB
      allowedImageFormats: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
      maxImageDimension: 2048,
      
      // Allowed IPs (empty = all, set to array for whitelist)
      ipWhitelist: [],
      
      // Suspicious Activity Thresholds
      suspiciousFailedLoginAttempts: 5,
      suspiciousAPICalls: 100,
      suspiciousTimeframe: 60 * 60 * 1000 // 1 hour
    };
  }

  // Validate password strength
  validatePasswordStrength(password) {
    const issues = [];
    
    if (password.length < this.config.passwordMinLength) {
      issues.push(`Password must be at least ${this.config.passwordMinLength} characters`);
    }
    
    if (this.config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      issues.push('Password must contain at least one uppercase letter');
    }
    
    if (this.config.passwordRequireNumbers && !/[0-9]/.test(password)) {
      issues.push('Password must contain at least one number');
    }
    
    if (this.config.passwordRequireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      issues.push('Password must contain at least one symbol (!@#$%^&*)');
    }
    
    return {
      isStrong: issues.length === 0,
      issues: issues
    };
  }

  // Check IP whitelist
  isIPAllowed(ip) {
    if (this.config.ipWhitelist.length === 0) {
      return true; // No whitelist, allow all
    }
    
    return this.config.ipWhitelist.includes(ip);
  }

  // Generate CSP header
  getCSPHeader() {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'", // Allow inline for admin panel
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'"
      ].join('; ')
    };
  }

  // Generate security headers
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      ...this.getCSPHeader()
    };
  }

  // Check for suspicious activity patterns
  isSuspiciousActivity(activityLog) {
    if (!activityLog || activityLog.length === 0) {
      return false;
    }
    
    const now = Date.now();
    const recentActivities = activityLog.filter(
      log => (now - new Date(log.timestamp).getTime()) < this.config.suspiciousTimeframe
    );
    
    // Check for excessive failed login attempts
    const failedLogins = recentActivities.filter(log => log.action === 'Failed login attempt');
    if (failedLogins.length > this.config.suspiciousFailedLoginAttempts) {
      return { suspicious: true, reason: 'Excessive failed login attempts' };
    }
    
    // Check for excessive API calls
    const apiCalls = recentActivities.filter(log => log.action?.includes('API'));
    if (apiCalls.length > this.config.suspiciousAPICalls) {
      return { suspicious: true, reason: 'Excessive API calls detected' };
    }
    
    return { suspicious: false };
  }

  // Get security recommendations
  getSecurityRecommendations() {
    return [
      '✅ Use HTTPS for all admin access',
      '✅ Enable two-factor authentication (future feature)',
      '✅ Regularly rotate admin password',
      '✅ Monitor audit logs for suspicious activity',
      '✅ Keep browser and extensions updated',
      '✅ Use strong, unique passwords',
      '✅ Enable device fingerprinting',
      '✅ Review and restrict API access',
      '✅ Set up IP whitelisting (optional)',
      '✅ Regular security audits and reviews'
    ];
  }
}

// Initialize security configuration
window.securityConfig = new SecurityConfig();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityConfig;
}

// Display security info on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('admin.html')) {
    console.log('🔐 Security Configuration Loaded');
    console.log('Security Headers:', window.securityConfig.getSecurityHeaders());
  }
});
