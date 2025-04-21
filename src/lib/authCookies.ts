
/**
 * Util: Auth Cookie Checking
 * Used by fetchAuth and other auth functions
 */

// Track repeated cookie checks to reduce logging
let lastCookieCheckTime = 0;
let lastCookieCheckResult = false;
const COOKIE_LOG_THROTTLE = 5000; // Only log cookie checks every 5 seconds

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
  const shouldLog = now - lastCookieCheckTime > COOKIE_LOG_THROTTLE;
  
  const cookieExists = authCookiePatterns.some(pattern =>
    cookies.some(cookie => cookie.startsWith(`${pattern}=`))
  );

  // Only log if the result has changed or enough time has passed
  if (shouldLog || cookieExists !== lastCookieCheckResult) {
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
