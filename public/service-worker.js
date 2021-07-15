const staticCacheName = "budget-static-cache";
const dataCacheName = "budget-data-cache";
const cacheFiles =
[
    "/",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(staticCacheName)
        .then((cache) => cache.addAll(cacheFiles))
    );

    // Cache the transactions from MongoDB
    event.waitUntil(
        caches.open(dataCacheName)
        .then((cache) => cache.add("/api/transaction"))
    );
});