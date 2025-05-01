
/**
 * Cookie detection utilities for auth
 * Responsible for checking auth-related cookies
 */

// Track repeated cookie checks to reduce logging
let lastCookieCheckTime = 0;
let lastCookieCheckResult = false;
const COOKIE_LOG_THROTTLE = 30000; // Only log cookie checks every 30 seconds
let loggingEnabled = false; // Disable verbose cookie logging by default

/**
 * Checks if any auth cookie exists in the browser
 */
export function hasAuthCookie(): boolean {
  // Look for session cookie based on the likely pattern used by the backend
  const cookies = document.cookie.split(';').map(c => c.trim());
  const authCookiePatterns = [
    'sb-access-token',
    'session-token',
    'auth-token',
    'auth.token',
    'sb-auth-token',
    'sb-auth'
  ];

  const now = Date.now();
  const shouldLog = loggingEnabled && now - lastCookieCheckTime > COOKIE_LOG_THROTTLE;
  
  const cookieExists = authCookiePatterns.some(pattern =>
    cookies.some(cookie => cookie.startsWith(`${pattern}=`))
  );

  // Only log if the result has changed or enough time has passed AND logging is enabled
  if (shouldLog || (loggingEnabled && cookieExists !== lastCookieCheckResult)) {
    lastCookieCheckTime = now;
    lastCookieCheckResult = cookieExists;
    
    // Only log detailed cookie info if cookies exist or it's a significant change
    if (cookieExists) {
      console.log("🍪 Auth cookie found:", {
        timestamp: new Date().toISOString()
      });
    } else if (shouldLog) {
      console.log("🍪 No auth cookies present");
    }
  }

  return cookieExists;
}

/**
 * Configures cookie logging
 */
export function setCookieLogging(enabled: boolean) {
  loggingEnabled = enabled;
  console.log(`🍪 Cookie logging ${enabled ? 'enabled' : 'disabled'}`);
}
