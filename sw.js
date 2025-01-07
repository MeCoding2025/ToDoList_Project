self.addEventListener('install', (event) => {
    console.log('Service Worker installed.');
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);
    event.notification.close(); 

    event.waitUntil(
        clients.openWindow('https://aakyilmaz-todolist.netlify.app/')
    );
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    console.log('Push received:', data);

    const title = data.title || 'Default Title';
    const options = {
        body: data.body || 'Default body text.',
        icon: data.icon || './assets/reminder-icon.png',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
