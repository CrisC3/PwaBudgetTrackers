const staticCacheName = "budget-static-cache";
const dataCacheName = "budget-data-cache";
const cacheFiles =
[
    "/",
    "/index.html",
    "/index.js",
    "/db.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", (event) => {

    // Caches site static files
    console.log("Caching static files");
    event.waitUntil(
        caches.open(staticCacheName)
        .then((cache) => cache.addAll(cacheFiles))
    );

    // Cache the /api/transaction fetch from MongoDB
    console.log("Caching transactions (API)");
    event.waitUntil(
        caches.open(dataCacheName)
        .then((cache) => cache.add("/api/transaction"))
    );
});

self.addEventListener("activate", (event) => {
    
    // Fetches the cache storage key names
    console.log("Activating");
    event.waitUntil(
        caches.keys()
        .then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== staticCacheName && key !== dataCacheName) {
                        console.log("Removing old cache data", "[", key, "]");
                        return caches.delete(key);
                    }
                })
            )
        })
    );
    
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {

    // Checks if the request URL contains the string "/api/"
    if (event.request.url.includes("/api/")) {

        event.respondWith(
            caches.open(dataCacheName)
            .then(cache => {
                
                return fetch(event.request)
                .then(response => {
                    
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
                .catch(error => {
                    return cache.match(event.request);
                });
            })
            .catch(error => console.log(error))
        );

        return;
    }

    event.respondWith(
        caches.open(staticCacheName)
        .then(cache => {
            return cache.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            });
        })
    );
});