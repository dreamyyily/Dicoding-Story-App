import '../styles/styles.css';
import App from './app.js';

const app = new App({
  content: document.querySelector('#main-content'),
  drawerButton: document.querySelector('#drawer-button'),
  navigationDrawer: document.querySelector('#navigation-drawer'),
});

const renderPage = async () => {
  await app.renderPage();
};

window.addEventListener('DOMContentLoaded', renderPage);
window.addEventListener('hashchange', renderPage);

renderPage();