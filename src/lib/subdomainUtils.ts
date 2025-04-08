
/**
 * Utility functions for handling subdomain-based routing and organization context
 */

import { supabase } from '@/lib/supabaseClient';

/**
 * Extracts the subdomain from the current hostname
 */
export function getSubdomain(hostname: string): string | null {
  // Don't process IP addresses
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }
  
  // Handle localhost 
  if (hostname.includes('localhost')) {
    return null;
  }
  
  const parts = hostname.split('.');
  
  // If we have a subdomain (e.g., tenant.sagebright.ai)
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

/**
 * Gets the organization identifier (slug) from the current URL
 * Uses subdomain in production or query param for development
 */
export function getOrgFromUrl(): string | null {
  // First check subdomain
  const subdomain = getSubdomain(window.location.hostname);
  if (subdomain) return subdomain;
  
  // Fallback to query param for local development
  const urlParams = new URLSearchParams(window.location.search);
  const orgParam = urlParams.get('org');
  return orgParam;
}

/**
 * Constructs the organization URL for a specific org slug
 */
export function getOrgUrl(orgSlug: string): string {
  if (window.location.hostname === 'localhost') {
    // For local development, use query param
    const url = new URL(window.location.href);
    url.searchParams.set('org', orgSlug);
    return url.toString();
  }
  
  // In production, use subdomain
  const domainParts = window.location.hostname.split('.');
  const rootDomain = domainParts.length > 2 
    ? domainParts.slice(1).join('.') 
    : domainParts.join('.');
    
  return window.location.protocol + '//' + orgSlug + '.' + rootDomain;
}

/**
 * Redirects to the organization-specific URL using org slug
 */
export function redirectToOrgUrl(orgSlug: string): void {
  const orgUrl = getOrgUrl(orgSlug);
  window.location.href = orgUrl;
}

/**
 * Fetch organization details by slug
 */
export async function getOrgBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('orgs')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching org by slug:', error);
    return null;
  }
}

/**
 * Fetch organization details by ID
 */
export async function getOrgById(orgId: string) {
  try {
    const { data, error } = await supabase
      .from('orgs')
      .select('*')
      .eq('id', orgId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching org by ID:', error);
    return null;
  }
}
