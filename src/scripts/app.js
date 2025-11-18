import routes from './routes/routes.js';
import { getActiveRoute } from './routes/url-parser.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupRouting();  
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }
    });
  }

  #routeGuard() {
    const token = localStorage.getItem('token');
    const url = getActiveRoute();

    const protectedRoutes = ['/', '/add', '/profile'];

    if (protectedRoutes.includes(url) && !token) {
      window.location.hash = '/login';
      return false; 
    }

    if (token && (url === '/login' || url === '/register')) {
      window.location.hash = '/';
      return false;
    }

    return true;
  }

  #setupRouting() {
    window.addEventListener('hashchange', () => {
      if (this.#routeGuard()) {
        this.renderPage();
      }
    });

    window.addEventListener('load', () => {
      if (this.#routeGuard()) {
        this.renderPage();
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const pageFactory = routes[url] || routes['/'];
    const page = pageFactory();

    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
