if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js').then(async reg => {
    console.log('SW registered', reg);

    const pushToggle = document.getElementById('push-toggle');
    if (pushToggle) {
      const sub = await reg.pushManager.getSubscription();
      pushToggle.checked = !!sub;

      pushToggle.addEventListener('click', async () => {
        if (pushToggle.checked) {
          const resp = await fetch('/vapid-public-key');
          const vapidPublicKey = await resp.text();
          const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey
          });

          await fetch('/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          });

          alert('Berhasil berlangganan notifikasi');
        } else {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            await fetch('/unsubscribe', {
              method: 'POST',
              body: JSON.stringify(sub)
            });
            await sub.unsubscribe();
          }
          alert('Berhenti berlangganan notifikasi');
        }
      });
    }
  }).catch(err => console.error('SW register failed', err));
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
