class NotificationHelper {
  static async requestPermission() {
    if (!('Notification' in window)) {
      alert('Browser tidak mendukung notifikasi.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      this.showNotification('Notifikasi diaktifkan ✅');
    } else {
      alert('Izin notifikasi ditolak ❌');
    }
  }

  static showNotification(message) {
    if (Notification.permission === 'granted') {
      new Notification('MyApp', {
        body: message,
        icon: '/icons/icon-192.png',
      });
    }
  }
}

export default NotificationHelper;
