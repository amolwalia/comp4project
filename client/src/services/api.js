const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed.');
    error.details = data.details || null;
    error.status = response.status;
    throw error;
  }

  return data;
}

export function signup(payload) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return request('/auth/logout', {
    method: 'POST'
  });
}

export function getCurrentUser() {
  return request('/auth/me');
}

export function getWishlist() {
  return request('/wishlist');
}

export function createWishlistItem(payload) {
  return request('/wishlist', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateWishlistItem(itemId, payload) {
  return request(`/wishlist/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteWishlistItem(itemId) {
  return request(`/wishlist/${itemId}`, {
    method: 'DELETE'
  });
}

