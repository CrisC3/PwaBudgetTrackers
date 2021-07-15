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

    // Caches site static files
    event.waitUntil(
        caches.open(staticCacheName)
        .then((cache) => cache.addAll(cacheFiles))
    );

    // Cache the /api/transaction fetch from MongoDB
    event.waitUntil(
        caches.open(dataCacheName)
        .then((cache) => cache.add("/api/transaction"))
    );
});

self.addEventListener("activate", (event) => {
    console.log("In 'Activate'");
    console.log("****************************");
    console.log(caches.keys());
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    event.waitUntil(
        console.log(caches.keys())
    );
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
});