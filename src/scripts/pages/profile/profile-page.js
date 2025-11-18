import { getActiveRoute } from '../../routes/url-parser.js';

export default class ProfilePage {
  async render() {
    this.loadProfileStyles();

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    return `
      <section class="container" aria-labelledby="profile-heading">
        <h1 id="profile-heading">Profil Pengguna</h1>

        ${isLoggedIn ? this.renderLoggedInView() : this.renderLoggedOutView()}
      </section>
    `;
  }

  loadProfileStyles() {
    if (document.getElementById('profile-styles')) return;

    const link = document.createElement('link');
    link.id = 'profile-styles';
    link.rel = 'stylesheet';
    link.href = './styles/profile-style.css';
    link.type = 'text/css';
    document.head.appendChild(link);
  }

  renderLoggedInView() {
    return `
      <div class="profile-info" role="region" aria-label="Status login pengguna">
        <p class="status-info">
          <strong>Status:</strong> 
          <span class="status-login" aria-live="polite">Login (terautentikasi)</span>
        </p>
        
        <button 
          id="logout-btn" 
          class="btn-logout" 
          type="button"
          aria-label="Keluar dari akun"
        >
          Logout
        </button>
      </div>
    `;
  }

  renderLoggedOutView() {
    return `
      <div class="login-prompt" role="alert">
        <p>Kamu belum login.</p>
        <div class="auth-links">
          <a href="#/login" class="auth-link">Masuk</a>
          <span aria-hidden="true"> | </span>
          <a href="#/register" class="auth-link">Daftar</a>
        </div>
      </div>
    `;
  }

  async afterRender() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin logout?')) {

        localStorage.removeItem('token');
        alert('Berhasil logout!');
        window.location.hash = '/login';
        

      }
    }); 
  }
}

}