
/**
 * Utility functions for handling subdomain-based organization routing
 */

// Define valid org slugs (should eventually come from API/database)
const VALID_ORG_SLUGS = ['lumon', 'demo', 'test'];

/**
 * Extract the organization slug from the current URL's subdomain
 * @returns The organization slug or null if not found
 */
export function getOrgFromUrl(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname;
    console.log("🌐 Current hostname:", hostname);
    
    // Skip localhost
    if (hostname === 'localhost') return null;
    
    // Handle IP addresses (no subdomains)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null;
    
    // Extract subdomain from hostname
    const parts = hostname.split('.');
    
    // Must have at least 3 parts for a subdomain (subdomain.domain.tld)
    if (parts.length < 3) return null;
    
    const subdomain = parts[0].toLowerCase();
    
    // Validate if this is a known org slug
    if (VALID_ORG_SLUGS.includes(subdomain)) {
      console.log("✅ Valid org subdomain detected:", subdomain);
      return subdomain;
    }
    
    return null;
  } catch (error) {
    console.error("❌ Error getting org from URL:", error);
    return null;
  }
}

/**
 * Redirect to the organization-specific URL
 * @param orgSlug The organization slug to redirect to
 */
export function redirectToOrgUrl(orgSlug: string): void {
  try {
    const href = window.location.href;
    const url = new URL(href);
    
    // Skip if we're already on this subdomain
    if (url.hostname.startsWith(`${orgSlug}.`)) {
      console.log("🔄 Already on correct org subdomain");
      return;
    }
    
    // Build new URL with the org subdomain
    const hostParts = url.hostname.split('.');
    
    // Skip localhost
    if (url.hostname === 'localhost') {
      console.log("⚠️ Cannot add subdomain to localhost");
      return;
    }
    
    // Handle different domain patterns
    let newHostname;
    if (hostParts.length >= 3) {
      // Replace existing subdomain
      hostParts[0] = orgSlug;
      newHostname = hostParts.join('.');
    } else {
      // Add subdomain to domain
      newHostname = `${orgSlug}.${url.hostname}`;
    }
    
    // Create new URL with the org subdomain
    const newUrl = new URL(url);
    newUrl.hostname = newHostname;
    
    console.log(`🚀 Redirecting to org URL: ${newUrl.toString()}`);
    window.location.href = newUrl.toString();
  } catch (error) {
    console.error("❌ Error redirecting to org URL:", error);
  }
}

/**
 * Check if current URL is on a subdomain
 */
export function isOnSubdomain(): boolean {
  return !!getOrgFromUrl();
}
