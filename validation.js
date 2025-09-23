/**
 * Input Validation and XSS Protection Utility
 * Provides comprehensive input validation and sanitization for admin forms
 */

class InputValidator {
  constructor() {
    this.maxLengths = {
      title: 200,
      summary: 500,
      description: 5000,
      content: 50000,
      url: 2000,
      tag: 50,
      name: 100,
      email: 320,
      phone: 20
    };
    
    this.patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      url: /^https?:\/\/.+/,
      phone: /^[\+]?[0-9\-\(\)\s]+$/,
      slug: /^[a-z0-9-]+$/,
      filename: /^[a-zA-Z0-9._-]+$/,
      alphaNumeric: /^[a-zA-Z0-9\s]+$/
    };
    
    this.xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>/gi,
      /<link[^>]*>/gi,
      /<meta[^>]*>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /Function\s*\(/gi
    ];
    
    this.init();
  }

  init() {
    // Add validation to all form inputs
    this.addInputValidation();
    
    // Add real-time validation feedback
    this.addRealTimeValidation();
  }

  addInputValidation() {
    document.addEventListener('submit', (e) => {
      if (e.target.tagName === 'FORM') {
        if (!this.validateForm(e.target)) {
          e.preventDefault();
        }
      }
    });
  }

  addRealTimeValidation() {
    document.addEventListener('input', (e) => {
      this.validateInput(e.target);
    });
    
    document.addEventListener('blur', (e) => {
      this.validateInput(e.target);
    });
  }

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showFormError(form, 'Please fix the validation errors before submitting.');
    }
    
    return isValid;
  }

  validateInput(input) {
    if (!input || !input.value) {
      this.clearValidationState(input);
      return true; // Allow empty unless required
    }

    const value = input.value.trim();
    const type = input.type;
    const id = input.id;
    const isRequired = input.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (isRequired && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }
    // XSS validation
    else if (this.containsXSS(value)) {
      isValid = false;
      errorMessage = 'Invalid content detected. Please remove any script tags or suspicious content.';
    }
    // Length validation
    else if (this.exceedsMaxLength(id, value)) {
      const maxLength = this.getMaxLength(id);
      isValid = false;
      errorMessage = `Maximum length is ${maxLength} characters. Current: ${value.length}`;
    }
    // Type-specific validation
    else if (type === 'email' && !this.patterns.email.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    }
    else if (type === 'url' && !this.patterns.url.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid URL starting with http:// or https://';
    }
    else if (type === 'tel' && !this.patterns.phone.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number.';
    }
    else if (id.includes('slug') && !this.patterns.slug.test(value)) {
      isValid = false;
      errorMessage = 'Slug can only contain lowercase letters, numbers, and hyphens.';
    }

    this.setValidationState(input, isValid, errorMessage);
    return isValid;
  }

  containsXSS(value) {
    return this.xssPatterns.some(pattern => pattern.test(value));
  }

  exceedsMaxLength(id, value) {
    const maxLength = this.getMaxLength(id);
    return maxLength && value.length > maxLength;
  }

  getMaxLength(id) {
    // Try to match field type from ID
    for (const [field, length] of Object.entries(this.maxLengths)) {
      if (id.includes(field)) {
        return length;
      }
    }
    
    // Default based on input type
    return 1000;
  }

  setValidationState(input, isValid, errorMessage = '') {
    this.clearValidationState(input);
    
    if (!isValid) {
      input.classList.add('invalid');
      input.style.borderColor = '#dc3545';
      
      // Create or update error message
      let errorDiv = document.getElementById(`${input.id}-error`);
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = `${input.id}-error`;
        errorDiv.className = 'validation-error';
        errorDiv.style.cssText = `
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        `;
        input.parentNode.appendChild(errorDiv);
      }
      errorDiv.textContent = errorMessage;
    } else {
      input.classList.add('valid');
      input.style.borderColor = '#28a745';
    }
  }

  clearValidationState(input) {
    if (!input) return;
    
    input.classList.remove('valid', 'invalid');
    input.style.borderColor = '';
    
    const errorDiv = document.getElementById(`${input.id}-error`);
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  showFormError(form, message) {
    let errorDiv = form.querySelector('.form-error');
    
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        padding: 10px 15px;
        border-radius: 6px;
        margin-top: 15px;
        font-weight: 500;
      `;
      form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Sanitization methods
  sanitizeHTML(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  sanitizeURL(url) {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }

  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 255);
  }

  sanitizeText(text, maxLength = 1000) {
    if (!text) return '';
    
    // Remove XSS patterns
    let cleaned = text;
    this.xssPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
    
    // Trim and limit length
    return cleaned.trim().substring(0, maxLength);
  }

  // Validation helpers for specific fields
  validateProject(data) {
    const errors = [];
    
    if (!data.title || data.title.length < 3) {
      errors.push('Project title must be at least 3 characters');
    }
    
    if (!data.summary || data.summary.length < 10) {
      errors.push('Project summary must be at least 10 characters');
    }
    
    if (data.link && !this.patterns.url.test(data.link)) {
      errors.push('Project link must be a valid URL');
    }
    
    if (data.tech && !Array.isArray(data.tech)) {
      errors.push('Technologies must be an array');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  validateBlog(data) {
    const errors = [];
    
    if (!data.title || data.title.length < 5) {
      errors.push('Blog title must be at least 5 characters');
    }
    
    if (!data.content || data.content.length < 50) {
      errors.push('Blog content must be at least 50 characters');
    }
    
    if (data.slug && !this.patterns.slug.test(data.slug)) {
      errors.push('Blog slug can only contain lowercase letters, numbers, and hyphens');
    }
    
    if (data.image && !this.patterns.url.test(data.image) && !data.image.startsWith('data:')) {
      errors.push('Blog image must be a valid URL or base64 data');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Mass sanitization for form data
  sanitizeFormData(formData) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        if (key.includes('url') || key.includes('link')) {
          sanitized[key] = this.sanitizeURL(value);
        } else if (key.includes('filename') || key.includes('image')) {
          sanitized[key] = value.startsWith('data:') ? value : this.sanitizeURL(value);
        } else {
          sanitized[key] = this.sanitizeText(value, this.getMaxLength(key));
        }
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeText(item, 100) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Initialize input validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('admin.html')) {
    window.inputValidator = new InputValidator();
    console.log('🛡️ Input validation enabled');
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputValidator;
}