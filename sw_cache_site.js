// Cache name — bumped automatically by tools/update-sw-version.js in CI
const cachename = "bpkc-1.0.5";

// Core assets to pre-cache
const assetsToCache = [
    '/',
    '/index.html',
    '/404.html',
    '/assets/css/styles.css',
    '/assets/js/index.js',
    '/assets/images/profile-img.webp',
    '/assets/images/google-logo.jpg',
    '/assets/images/amazon-logo.jpg',
    '/assets/images/ohio-at-home-logo.jpg',
    '/assets/images/capgemini-logo.jpg',
    '/assets/images/utd-logo.jpg',
    '/assets/images/anu.png',
    'https://fonts.googleapis.com/css2?family=Libre+Franklin:ital@0;1&family=Lobster&display=swap'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cachename)
            .then(cache => cache.addAll(assetsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cache => cache !== cachename ? caches.delete(cache) : undefined)
        )).then(() => self.clients.claim())
    );
});

const putInCache = (request, response) => {
    const copy = response.clone();
    caches.open(cachename).then(cache => cache.put(request, copy));
};

// Network-first for pages: visitors always get fresh HTML when online,
// the cached copy (or cached index.html) when offline (F9)
const handleNavigation = request =>
    fetch(request)
        .then(response => {
            if (response && response.status === 200) putInCache(request, response);
            return response;
        })
        .catch(() =>
            caches.match(request).then(cached => cached || caches.match('/index.html'))
        );

// Cache-first for same-origin static assets (invalidated by the cache-name
// bump on deploy); stale-while-revalidate for cross-origin resources such
// as the Google Fonts stylesheet
const fetchAndCache = request =>
    fetch(request).then(response => {
        if (response && response.status === 200) putInCache(request, response);
        return response;
    });

const handleAsset = (request, revalidate) =>
    caches.match(request).then(cached => {
        if (cached) {
            if (revalidate) fetchAndCache(request).catch(() => { });
            return cached;
        }
        return fetchAndCache(request);
    });

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);

    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
        e.respondWith(handleNavigation(e.request));
        return;
    }

    e.respondWith(handleAsset(e.request, url.origin !== self.location.origin));
});
