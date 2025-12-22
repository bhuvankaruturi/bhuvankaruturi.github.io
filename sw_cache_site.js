// Cache name - increment this when you update your site assets
const cachename = "bpkc-1.0.1";

// Assets to pre-cache
const assetsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/index.js',
    '/assets/js/main.js',
    '/assets/js/app/markupGenerator.js',
    '/assets/data/experience.yaml',
    '/assets/data/education.yaml',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Libre+Franklin:ital@0;1&family=Lobster&display=swap'
];

// Installing the service worker and pre-caching assets
self.addEventListener('install', e => {
    console.log('Service Worker: Installing...');
    e.waitUntil(
        caches.open(cachename).then(cache => {
            console.log('Service Worker: Pre-caching core assets');
            return cache.addAll(assetsToCache);
        }).then(() => self.skipWaiting())
    );
});

// Activating the service worker and clearing old caches
self.addEventListener('activate', e => {
    console.log('Service Worker: Activating...');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cachename) {
                        console.log('Service Worker: Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Cache falling back to network strategy with dynamic caching
self.addEventListener('fetch', e => {
    // Skip non-GET requests
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            // If not in cache, fetch from network and cache for next time
            return fetch(e.request).then(networkResponse => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                // Clone the response to store in cache
                const responseToCache = networkResponse.clone();
                caches.open(cachename).then(cache => {
                    cache.put(e.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Return a fallback if both fail (optional, e.g., offline page)
            });
        })
    );
});