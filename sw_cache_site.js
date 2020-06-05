// cache name
const cachename = "bpkc1"

// installing the service worker
self.addEventListener('install', e => {
    // console.log("Service worker installed");
})

// activating the service worker
self.addEventListener('activate', e => {
    // console.log("Service worker activated");
    // delete old caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cachename) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// cache the response on a fetch event
self.addEventListener('fetch', e => {
    // console.log('Service worker: fetching');
    e.respondWith(
        // browser request to load the page
        fetch(e.request)
            .then(res => {
                // make a copy of the response
                const resCopy = res.clone();
                // open cache
                caches
                    .open(cachename)
                    .then(cache => {
                        // Add the response copy to cache
                        cache.put(e.request, resCopy);
                    });
                return res;
            })
            .catch(err => caches.match(e.request).then(res => res))
    )
})