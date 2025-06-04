self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // Activate SW immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Basic fetch handler: try network first, otherwise return a fallback response
  event.respondWith(
    fetch(event.request).catch(() =>
      new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      })
    )
  );
});

