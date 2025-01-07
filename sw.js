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

self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_REMINDER') {
        const { taskText, delay } = event.data;
        
        setTimeout(() => {
            self.registration.showNotification("Task Reminder", {
                body: `Reminder: ${taskText}`,
                icon: './assets/reminder-icon.png',
            });
        }, delay);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
});