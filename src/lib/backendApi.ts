
import { supabase } from './supabaseClient';
import { handleApiError } from './handleApiError';

const API_BASE_URL = 'https://sagebright-backend-production.up.railway.app/api';

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('No auth token found');
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const text = await res.text();
      let error;
    
      try {
        error = JSON.parse(text);
      } catch (e) {
        throw new Error(`Non-JSON error: ${text.slice(0, 100)}`);
      }
    
      throw new Error(error.message || 'API request failed');
    }
    
    return res.json();
  } catch (error) {
    // Log the error but don't show toast - let the caller decide that
    handleApiError(error, {
      context: 'API request',
      showToast: false,
      shouldThrow: true
    });
    throw error; // Re-throw to let the caller handle it
  }
}

export async function getUsers() {
  try {
    const res = await fetchWithAuth('/users');
    return res.data;
  } catch (error) {
    handleApiError(error, {
      context: 'fetching users',
      fallbackMessage: 'Unable to load users. Please try again.'
    });
    return [];
  }
}

export async function getDepartments() {
  try {
    const res = await fetchWithAuth('/departments');
    return res.data;
  } catch (error) {
    handleApiError(error, {
      context: 'fetching departments',
      fallbackMessage: 'Unable to load departments. Please try again.'
    });
    return [];
  }
}

export async function getRoadmaps() {
  try {
    const res = await fetchWithAuth('/roadmaps');
    return res.data;
  } catch (error) {
    handleApiError(error, {
      context: 'fetching roadmaps',
      fallbackMessage: 'Unable to load roadmaps. Please try again.'
    });
    return [];
  }
}
