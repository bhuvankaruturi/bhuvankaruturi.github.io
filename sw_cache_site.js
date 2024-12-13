// cache name
const cachename = "bpkc4"

// activating the service worker
self.addEventListener('activate', e => {
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
    e.respondWith(
        // check the cache if the requested resources are already present
        caches
        .match(e.request)
        .then(res => {
            // if a match is found return it
            if (res)
                return res;
            // else perform a fetch request for the resources
            return fetchResources(e.request);
        })
        .catch(err => fetchResources(e.request))
    );
});

const fetchResources = req => {
    return fetch(req)
            .then( res => {
                // check if the response is valid and is not a response to request from third party
                if (!res || res.status !== 200 || res.type !== 'basic') {
                    return res;
                }

                // clone the response as the browser also need to consume the stream
                var resCopy = res.clone();

                //open the cache and store the response copy
                caches.open(cachename)
                    .then(cache => {
                        cache.put(req, resCopy);
                    });

                // return the response
                return res;
            }
    );
}