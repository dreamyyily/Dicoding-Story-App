import CONFIG from './config.js';

export async function login(email, password) {
  const res = await fetch(`${CONFIG.BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  localStorage.setItem('token', data.loginResult.token);
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${CONFIG.BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getStories() {
  const token = localStorage.getItem('token');

  const res = await fetch(`${CONFIG.BASE_URL}/stories`, {
    headers: {
      Authorization: `Bearer ${token || ''}`, 
    },
  });

  const data = await res.json();

  if (data.error === true) {
    throw new Error(data.message || 'Gagal mengambil data cerita');
  }

  return Array.isArray(data.listStory) ? data.listStory : [];
}

export async function addStory(formData) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (data.error === true) {
    throw new Error(data.message || 'Gagal menambah cerita');
  }

  return data;
}