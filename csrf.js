/**
 * CSRF Protection Utility
 * Generates and validates CSRF tokens to prevent cross-site request forgery attacks
 */

class CSRFProtection {
  constructor() {
    this.tokenKey = 'csrf_token';
    this.headerName = 'X-CSRF-Token';
    this.tokenLength = 32;
    this.tokenLifetime = 1 * 60 * 60 * 1000; // 1 hour
    
    this.init();
  }

  init() {
    // Generate token on page load if needed
    this.ensureToken();
    
    // Add token to all forms
    this.addTokenToForms();
    
    // Intercept fetch requests to add CSRF token
    this.interceptFetch();
  }

  generateToken() {
    const array = new Uint8Array(this.tokenLength);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  ensureToken() {
    const stored = this.getStoredToken();
    
    if (!stored || this.isTokenExpired(stored)) {
      const newToken = {
        value: this.generateToken(),
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.tokenKey, JSON.stringify(newToken));
      return newToken.value;
    }
    
    return stored.value;
  }

  getStoredToken() {
    try {
      const stored = localStorage.getItem(this.tokenKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  isTokenExpired(token) {
    if (!token || !token.timestamp) return true;
    
    const age = Date.now() - token.timestamp;
    return age > this.tokenLifetime;
  }

  getToken() {
    return this.ensureToken();
  }

  addTokenToForms() {
    // Add hidden CSRF token inputs to all forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      if (!form.querySelector('input[name="csrf_token"]')) {
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'csrf_token';
        tokenInput.value = this.getToken();
        form.appendChild(tokenInput);
      }
    });
  }

  interceptFetch() {
    // Store original fetch
    const originalFetch = window.fetch;
    
    // Override fetch to add CSRF token
    window.fetch = (url, options = {}) => {
      // Only add CSRF token to POST, PUT, DELETE requests to our own domain
      const method = options.method?.toLowerCase();
      const isModifyingRequest = ['post', 'put', 'delete', 'patch'].includes(method);
      const isOwnDomain = !url.startsWith('http') || url.startsWith(window.location.origin);
      
      if (isModifyingRequest && isOwnDomain) {
        // Add CSRF token to headers
        options.headers = {
          ...options.headers,
          [this.headerName]: this.getToken()
        };
        
        // If sending form data, add token to body
        if (options.body instanceof FormData) {
          options.body.append('csrf_token', this.getToken());
        } else if (options.body && typeof options.body === 'string') {
          try {
            const bodyData = JSON.parse(options.body);
            bodyData.csrf_token = this.getToken();
            options.body = JSON.stringify(bodyData);
          } catch {
            // If body is not JSON, leave as is
          }
        }
      }
      
      return originalFetch(url, options);
    };
  }

  validateToken(receivedToken) {
    const currentToken = this.getToken();
    return receivedToken === currentToken;
  }

  // Method for manual token validation (for custom AJAX requests)
  addTokenToRequest(options = {}) {
    const token = this.getToken();
    
    return {
      ...options,
      headers: {
        ...options.headers,
        [this.headerName]: token
      }
    };
  }

  // Refresh token (useful after successful operations)
  refreshToken() {
    localStorage.removeItem(this.tokenKey);
    return this.ensureToken();
  }
}

// Client-side CSRF validation helper
class CSRFValidator {
  static validateFormSubmission(event) {
    const form = event.target;
    const tokenInput = form.querySelector('input[name="csrf_token"]');
    
    if (!tokenInput || !tokenInput.value) {
      console.error('CSRF token missing from form submission');
      event.preventDefault();
      alert('Security error: Invalid form submission. Please refresh the page and try again.');
      return false;
    }
    
    return true;
  }
  
  static setupFormValidation() {
    // Add validation to all forms
    document.addEventListener('submit', CSRFValidator.validateFormSubmission);
  }
}

// Initialize CSRF protection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('admin.html')) {
    window.csrfProtection = new CSRFProtection();
    CSRFValidator.setupFormValidation();
    
    console.log('🛡️ CSRF Protection enabled');
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CSRFProtection, CSRFValidator };
}