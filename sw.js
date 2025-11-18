const CACHE_NAME = 'share-story-v4';

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'NEW_STORY') {
    const { title, body, icon, url } = event.data.payload;

    const options = {
      body: body,
      icon: icon || '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: { url: url || '/' },
      actions: [
        { action: 'view', title: 'Lihat Cerita', icon: '/icons/view.png' },
        { action: 'close', title: 'Tutup', icon: '/icons/close.png' }
      ],
      tag: 'new-story',
      renotify: true
    };

    self.registration.showNotification(title, options);
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'view') {
    clients.openWindow(event.notification.data.url || '/');
  } else {
    clients.openWindow('/');
  }
});