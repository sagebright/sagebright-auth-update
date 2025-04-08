import { supabase } from './supabaseClient';

const API_BASE_URL = 'https://sagebright-backend-production.up.railway.app/api';

async function fetchWithAuth(path: string, options: RequestInit = {}) {
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
    const error = await res.json();
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

export async function getUsers() {
  const res = await fetchWithAuth('/users');
  return res.data;
}
export async function getDepartments() {
  const res = await fetchWithAuth('/departments');
  return res.data;
}
