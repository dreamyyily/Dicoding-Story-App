// src/scripts/index.js — FINAL VERSION YANG 100% JALAN!

import App from './app.js';

// INI YANG HILANG SELAMA INI!!! WAJIB ADA!
const app = new App({
  navigationDrawer: document.getElementById('navigation-drawer'),
  drawerButton: document.getElementById('drawer-button'),
  content: document.getElementById('main-content'),
});

// SERVICE WORKER + PUSH NOTIFICATION (kode kamu tetap jalan)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      console.log('Service Worker registered:', reg);
      initPushNotification(reg); // Panggil fungsi push
    })
    .catch(err => console.error('SW registration failed:', err));
}

// Fungsi Push Notification (biar rapi)
function initPushNotification(registration) {
  const pushToggle = document.getElementById('push-toggle');
  if (!pushToggle) return;

  // Cek status langganan
  registration.pushManager.getSubscription()
    .then(sub => {
      pushToggle.checked = !!sub;
    });

  pushToggle.addEventListener('click', async () => {
    if (pushToggle.checked) {
      try {
        const resp = await fetch('/vapid-public-key');
        const vapidPublicKey = await resp.text();
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });

        await fetch('/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });

        alert('Berhasil berlangganan notifikasi!');
      } catch (err) {
        pushToggle.checked = false;
        alert('Gagal berlangganan: ' + err.message);
      }
    } else {
      try {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await fetch('/unsubscribe', {
            method: 'POST',
            body: JSON.stringify(subscription)
          });
          await subscription.unsubscribe();
        }
        alert('Berhenti berlangganan notifikasi');
      } catch (err) {
        console.error(err);
      }
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}