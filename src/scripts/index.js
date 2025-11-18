import App from './app.js';
import NotificationHelper from './utils/notification-helper.js';

const app = new App({
  navigationDrawer: document.getElementById('navigation-drawer'),
  drawerButton: document.getElementById('drawer-button'),
  content: document.getElementById('main-content'),
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('btn-install');
  if (!installBtn) return;

  installBtn.style.display = 'block';
  installBtn.addEventListener('click', async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response:', outcome);
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
});

const pushToggle = document.getElementById('push-toggle');
if (pushToggle) {
  pushToggle.addEventListener('click', async () => {
    if (pushToggle.checked) {
      await NotificationHelper.requestPermission();
      NotificationHelper.showNotification('Notifikasi diaktifkan!');
    } else {
      NotificationHelper.showNotification('Notifikasi dimatikan ❌');
    }
  });
}
const subBtn = document.getElementById('subscribe-btn');
if (subBtn) {
  subBtn.addEventListener('click', async () => {
    await NotificationHelper.requestPermission();
    NotificationHelper.showNotification('Notifikasi berhasil diaktifkan!');
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('SW registration failed:', err));
}
