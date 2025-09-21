// Service Worker for Vision United Worship Center
const CACHE_NAME = 'vision-united-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.log('Cache addAll failed:', error);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request).catch(function() {
                    // If both cache and network fail, return a fallback
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for when connection is restored
self.addEventListener('sync', function(event) {
    console.log('Background sync triggered:', event.tag);
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle any background sync tasks
            console.log('Background sync completed')
        );
    }
});