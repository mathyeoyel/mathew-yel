/**
 * Simple client-side authentication for admin panel
 * Note: This provides basic protection but should be supplemented with server-side auth
 */

class AdminAuth {
  constructor() {
    this.sessionKey = 'admin_session';
    this.tokenKey = 'admin_token';
    this.maxAttempts = 3;
    this.lockoutTime = 15 * 60 * 1000; // 15 minutes
    this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
    
    // Store the correct password hash (change this to your own secure password)
    // This is SHA-256 hash of "admin123" - CHANGE THIS!
    this.correctPasswordHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
    
    this.init();
  }

  init() {
    // Check if we're on admin page
    if (window.location.pathname.includes('admin.html')) {
      this.checkAuthOnLoad();
    }
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  checkAuthOnLoad() {
    const session = this.getSession();
    
    if (!session || !this.isSessionValid(session)) {
      this.showLoginForm();
      return false;
    }
    
    // Valid session - show admin panel
    this.showAdminPanel();
    this.setupLogout();
    return true;
  }

  getSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  }

  isSessionValid(session) {
    if (!session || !session.token || !session.timestamp) {
      return false;
    }
    
    // Check if session has expired
    const now = Date.now();
    const sessionAge = now - session.timestamp;
    
    if (sessionAge > this.sessionTimeout) {
      this.clearSession();
      return false;
    }
    
    return true;
  }

  clearSession() {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('admin_password_hash');
  }

  getAttempts() {
    try {
      const attempts = localStorage.getItem('login_attempts');
      return attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: 0 };
    } catch {
      return { count: 0, lastAttempt: 0 };
    }
  }

  setAttempts(count) {
    const attempts = {
      count: count,
      lastAttempt: Date.now()
    };
    localStorage.setItem('login_attempts', JSON.stringify(attempts));
  }

  isLockedOut() {
    const attempts = this.getAttempts();
    
    if (attempts.count >= this.maxAttempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < this.lockoutTime) {
        return Math.ceil((this.lockoutTime - timeSinceLastAttempt) / 1000 / 60); // minutes remaining
      } else {
        // Reset attempts after lockout period
        this.setAttempts(0);
        return false;
      }
    }
    
    return false;
  }

  showLoginForm() {
    // Hide admin content
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
      adminContainer.style.display = 'none';
    }

    // Create login form
    const loginHTML = `
      <div id="login-container" style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        ">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007acc; margin-bottom: 10px;">🔐 Admin Access</h1>
            <p style="color: #666;">Enter your password to continue</p>
          </div>
          
          <form id="login-form">
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">
                Password
              </label>
              <input
                type="password"
                id="admin-password"
                placeholder="Enter admin password"
                style="
                  width: 100%;
                  padding: 12px;
                  border: 2px solid #ddd;
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
                required
              >
            </div>
            
            <button
              type="submit"
              id="login-btn"
              style="
                width: 100%;
                background: #007acc;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.3s ease;
              "
            >
              Login
            </button>
          </form>
          
          <div id="login-message" style="
            margin-top: 15px;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            display: none;
          "></div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <small style="color: #999; text-align: center; display: block;">
              🛡️ Protected by authentication • Multiple failed attempts will result in temporary lockout
            </small>
          </div>
        </div>
      </div>
    `;

    document.body.innerHTML = loginHTML;
    
    // Setup login form handler
    this.setupLoginForm();
  }

  setupLoginForm() {
    const form = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginBtn = document.getElementById('login-btn');
    const messageDiv = document.getElementById('login-message');

    // Check if locked out
    const lockoutMinutes = this.isLockedOut();
    if (lockoutMinutes) {
      this.showMessage(`Too many failed attempts. Try again in ${lockoutMinutes} minutes.`, 'error');
      loginBtn.disabled = true;
      setTimeout(() => {
        window.location.reload();
      }, 60000); // Check again in 1 minute
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
      }
    });

    // Focus password input
    passwordInput.focus();
  }

  async handleLogin() {
    const passwordInput = document.getElementById('admin-password');
    const loginBtn = document.getElementById('login-btn');
    const password = passwordInput.value.trim();

    if (!password) {
      this.showMessage('Please enter a password', 'error');
      return;
    }

    // Disable button during login
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
      const hashedPassword = await this.hashPassword(password);
      
      if (hashedPassword === this.correctPasswordHash) {
        // Successful login
        const token = this.generateToken();
        const session = {
          token: token,
          timestamp: Date.now()
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        localStorage.setItem('admin_password_hash', hashedPassword); // Store for API calls
        this.setAttempts(0); // Reset failed attempts
        
        this.showMessage('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } else {
        // Failed login
        const attempts = this.getAttempts();
        const newAttemptCount = attempts.count + 1;
        this.setAttempts(newAttemptCount);
        
        const remainingAttempts = this.maxAttempts - newAttemptCount;
        
        if (remainingAttempts <= 0) {
          this.showMessage(`Too many failed attempts. Access locked for 15 minutes.`, 'error');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.showMessage(`Invalid password. ${remainingAttempts} attempts remaining.`, 'error');
        }
        
        passwordInput.value = '';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showMessage('Login error occurred. Please try again.', 'error');
    }

    // Re-enable button
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById('login-message');
    if (!messageDiv) return;

    messageDiv.style.display = 'block';
    messageDiv.textContent = message;
    
    // Reset classes
    messageDiv.className = '';
    
    if (type === 'success') {
      messageDiv.style.background = '#d4edda';
      messageDiv.style.color = '#155724';
      messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
      messageDiv.style.background = '#f8d7da';
      messageDiv.style.color = '#721c24';
      messageDiv.style.border = '1px solid #f5c6cb';
    }
  }

  showAdminPanel() {
    // Remove login form if it exists
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
      loginContainer.remove();
    }

    // Show admin content
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
      adminContainer.style.display = 'block';
    }
  }

  setupLogout() {
    // Add logout button to admin header
    const adminHeader = document.querySelector('.admin-header');
    if (adminHeader && !document.getElementById('logout-btn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'logout-btn';
      logoutBtn.textContent = '🚪 Logout';
      logoutBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s ease;
      `;
      
      logoutBtn.addEventListener('mouseenter', () => {
        logoutBtn.style.background = '#c82333';
      });
      
      logoutBtn.addEventListener('mouseleave', () => {
        logoutBtn.style.background = '#dc3545';
      });
      
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
      
      adminHeader.style.position = 'relative';
      adminHeader.appendChild(logoutBtn);
    }

    // Auto-logout on session expiry
    setInterval(() => {
      const session = this.getSession();
      if (!session || !this.isSessionValid(session)) {
        this.logout();
      }
    }, 60000); // Check every minute
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.clearSession();
      window.location.reload();
    }
  }

  // Method to get current session token for API calls
  getAuthToken() {
    const session = this.getSession();
    return session && this.isSessionValid(session) ? session.token : null;
  }

  // Method to check if user is authenticated (for API calls)
  isAuthenticated() {
    const session = this.getSession();
    return session && this.isSessionValid(session);
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminAuth = new AdminAuth();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminAuth;
}