import { getStories } from '../../model.js';
import { initMap } from '../../utils/map.js';

export default class HomePage {
  async render() {
  this.loadHomeStyles();
  return `
    <section class="container home-page">
      <!-- HANYA 1 H1 DI SINI -->
      <h1 class="page-title">Daftar Cerita</h1>
      <p class="page-subtitle">Daftar semua cerita pengguna</p>

      <!-- LABEL UNTUK INPUT CARI -->
      <label for="filter" class="visually-hidden">
        Cari cerita berdasarkan nama atau deskripsi
      </label>
      <input 
        type="text" 
        id="filter" 
        placeholder="Cari cerita..." 
        class="search-input"
        aria-label="Cari ceritaberdasarkan nama atau deskripsi"
      />

      <div class="content-layout">
        <!-- BAGIAN KIRI: LIST CERITA -->
        <section class="stories-section" aria-labelledby="stories-heading">
          <h2 id="stories-heading" class="section-title">Daftar Cerita</h2>
          <div id="story-list" class="story-list"></div>
        </section>

        <!-- BAGIAN KANAN: PETA -->
        <section class="map-section" aria-labelledby="map-heading">
          <h2 id="map-heading" class="section-title">Peta Lokasi Cerita</h2>
          <div id="map" class="map-container"></div>
        </section>
      </div>
    </section>
  `;
}

  loadHomeStyles() {
    if (document.getElementById('home-styles')) return;
    
    const link = document.createElement('link');
    link.id = 'home-styles';
    link.rel = 'stylesheet';
    link.href = './styles/home-style.css';
    document.head.appendChild(link);
  }

  async afterRender() {
    try {
      const stories = await getStories();
      this.renderStories(stories);
      this.initMap(stories);
      this.initFilter(stories);
    } catch (error) {
      console.error('Error loading stories:', error);
      document.getElementById('story-list').innerHTML = '<p>Gagal memuat cerita.</p>';
    }
  }

renderStories(stories) {
  const storyList = document.getElementById('story-list');
  
  if (!stories || stories.length === 0) {
    storyList.innerHTML = '<p class="no-stories">Tidak ada cerita ditemukan.</p>';
    return;
  }

  storyList.innerHTML = stories.map(story => {
    const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <article class="story-card" tabindex="0">
        <img 
          src="${story.photoUrl}" 
          alt="Foto cerita dari ${story.name}" 
          class="story-image"
          loading="lazy"
        />
        
        <!-- PASTIKAN ADA DIV INI! -->
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <time class="story-date" datetime="${story.createdAt}">${date}</time>
          <p class="story-desc">${story.description}</p>
        </div>
      </article>
    `;
  }).join('');
}

  initMap(stories) {
    const { map } = initMap("map", () => {});
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon]).addTo(map).bindPopup(`
          <div class="map-popup">
            <h4>${story.name}</h4>
            <p>${story.description}</p>
            ${
              story.photoUrl
                ? `<img src="${story.photoUrl}" alt="${story.name}" style="max-width: 150px;" />`
                : ""
            }
          </div>
        `);
      } else {
        console.warn(`Cerita ${story.name} tidak memiliki lat/lon yang valid`);
      }
    });
  }

  initFilter(stories) {
    const filterInput = document.getElementById('filter');
    
    filterInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filteredStories = stories.filter(story => 
        story.name.toLowerCase().includes(query) || 
        story.description.toLowerCase().includes(query)
      );
      this.renderStories(filteredStories);
    });
  }
}