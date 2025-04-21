
/**
 * Util: Auth Cookie Checking
 * Used by fetchAuth and other auth functions
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

  console.log("🍪 Checking for auth cookies:", {
    allCookies: cookies,
    cookieString: document.cookie
  });

  const cookieExists = authCookiePatterns.some(pattern =>
    cookies.some(cookie => cookie.startsWith(`${pattern}=`))
  );

  console.log("🍪 Auth cookie check result:", {
    exists: cookieExists,
    cookies: document.cookie.length > 100
      ? document.cookie.substring(0, 100) + '...'
      : document.cookie
  });

  return cookieExists;
}
