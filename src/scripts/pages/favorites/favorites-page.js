import { Idb } from '../../utils/idb.js';

export default class FavoritesPage {
  async render() {
    return `
      <section class="container">
        <h1>Favoritku</h1>
        <div id="favorites-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const stories = await Idb.getAll();
    const listEl = document.getElementById('favorites-list');

    if (!stories || stories.length === 0) {
      listEl.innerHTML = '<p>Tidak ada cerita favorit.</p>';
      return;
    }

    listEl.innerHTML = stories.map(story => `
      <article class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
      </article>
    `).join('');
  }
}
