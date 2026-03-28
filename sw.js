// sw.js - Service Worker for TechVista
// Implements: Cache-first for static assets, network-first for HTML

const CACHE_NAME = 'techvista-v1';
const STATIC_CACHE = 'techvista-static-v1';
const IMAGE_CACHE = 'techvista-images-v1';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/portfolio.html',
    '/contact.html',
    '/index-optimized.html',
    '/optimized/css/styles.min.css',
    '/optimized/js/bundle.min.js',
    '/offline.html'
];

// ===== INSTALL EVENT =====
// Pre-cache all static assets when SW installs
self.addEventListener('install', function(event) {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(function(cache) {
                console.log('[SW] Pre-caching static assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(function() {
                // Force new SW to activate immediately
                return self.skipWaiting();
            })
            .catch(function(err) {
                console.log('[SW] Pre-cache error:', err);
            })
    );
});

// ===== ACTIVATE EVENT =====
// Clean up old caches when SW activates
self.addEventListener('activate', function(event) {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        // Delete caches that are not current version
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== IMAGE_CACHE &&
                            cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                // Take control of all open clients
                return self.clients.claim();
            })
    );
});

// ===== FETCH EVENT =====
// Intercept all network requests
self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Chrome extensions and non-http requests
    if (!event.request.url.startsWith('http')) return;

    // Strategy 1: Cache-first for CSS, JS, fonts
    if (isStaticAsset(event.request.url)) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // Strategy 2: Cache-first for images (with image-specific cache)
    if (isImageRequest(event.request.url)) {
        event.respondWith(imageCache(event.request));
        return;
    }

    // Strategy 3: Network-first for HTML pages
    if (isHTMLRequest(event.request)) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Strategy 4: Stale-while-revalidate for API calls
    event.respondWith(staleWhileRevalidate(event.request));
});

// ===== CACHING STRATEGIES =====

// Cache First: Return cached version, fallback to network
function cacheFirst(request) {
    return caches.match(request)
        .then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(request).then(function(networkResponse) {
                if (networkResponse.ok) {
                    var responseClone = networkResponse.clone();
                    caches.open(STATIC_CACHE).then(function(cache) {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            });
        });
}

// Network First: Try network, fallback to cache, then offline page
function networkFirst(request) {
    return fetch(request)
        .then(function(networkResponse) {
            if (networkResponse.ok) {
                var responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(request, responseClone);
                });
            }
            return networkResponse;
        })
        .catch(function() {
            return caches.match(request)
                .then(function(cachedResponse) {
                    return cachedResponse || caches.match('/offline.html');
                });
        });
}

// Stale-While-Revalidate: Return cache immediately, update in background
function staleWhileRevalidate(request) {
    return caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(request).then(function(cachedResponse) {
            var fetchPromise = fetch(request).then(function(networkResponse) {
                cache.put(request, networkResponse.clone());
                return networkResponse;
            }).catch(function() {
                // Network failed, cached response will be used
            });
            return cachedResponse || fetchPromise;
        });
    });
}

// Image cache with size limit
function imageCache(request) {
    return caches.open(IMAGE_CACHE).then(function(cache) {
        return cache.match(request).then(function(cachedResponse) {
            if (cachedResponse) return cachedResponse;
            return fetch(request).then(function(networkResponse) {
                if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(function() {
                // Return a placeholder image or fail silently
                return new Response('', {status: 408, statusText: 'Image not available'});
            });
        });
    });
}

// ===== HELPER FUNCTIONS =====

function isStaticAsset(url) {
    return url.match(/\.(css|js|woff|woff2|ttf|eot)(\?.*)?$/);
}

function isImageRequest(url) {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)(\?.*)?$/) || 
           url.includes('images.unsplash.com');
}

function isHTMLRequest(request) {
    return request.headers.get('accept') && 
           request.headers.get('accept').includes('text/html');
}

// ===== BACKGROUND SYNC =====
// Handle form submissions when offline
self.addEventListener('sync', function(event) {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

function syncContactForm() {
    // In a real app, read from IndexedDB and retry failed form submissions
    return Promise.resolve();
}

// ===== PUSH NOTIFICATIONS =====
// Handle push notifications (example implementation)
self.addEventListener('push', function(event) {
    if (!event.data) return;
    
    var data = event.data.json();
    var options = {
        body: data.body || 'New notification from TechVista',
        icon: '/images/icon-192.png',
        badge: '/images/badge-72.png',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'TechVista', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('[SW] Service Worker script loaded');
