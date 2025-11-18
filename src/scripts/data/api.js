// import CONFIG from '../config';

// const BASE_URL = CONFIG.BASE_URL;

// export const StoryAPI = {
//   async login({ email, password }) {
//     const res = await fetch(`${BASE_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) throw new Error((await res.json()).message || 'Login gagal');
//     return res.json();
//   },

//   async register({ name, email, password }) {
//     const res = await fetch(`${BASE_URL}/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password }),
//     });
//     if (!res.ok) throw new Error((await res.json()).message || 'Registrasi gagal');
//     return res.json();
//   },

//   async getStories({ token, withLocation = true, page = 1, size = 20 } = {}) {
//     const url = new URL(`${BASE_URL}/stories`);
//     if (withLocation) url.searchParams.set('location', '1');
//     url.searchParams.set('page', String(page));
//     url.searchParams.set('size', String(size));
//     const res = await fetch(url.toString(), {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) throw new Error('Gagal memuat stories');
//     return res.json();
//   },

//   async addStory({ token, description, photoBlob, lat, lon }) {
//     const form = new FormData();
//     form.append('description', description);
//     form.append('photo', photoBlob, 'photo.jpg');
//     if (lat != null && lon != null) {
//       form.append('lat', String(lat));
//       form.append('lon', String(lon));
//     }
//     const res = await fetch(`${BASE_URL}/stories`, {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}` },
//       body: form,
//     });
//     if (!res.ok) throw new Error((await res.json()).message || 'Gagal menambah story');
//     return res.json();
//   },
// };
