var cacheStorageName = 'restaurant-v1';

const initialCacheList = [
  '/',
  'js/main.js',
  'js/dbhelper.js',
  'js/restaurant_info.js',
  'css/styles.css',
  'data/restaurants.json',
  'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheStorageName).then((cache) => {
      return cache.addAll(initialCacheList);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('restaurant-') && cacheName != cacheStorageName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {

  event.respondWith(
    caches.match(event.request).then((response) => {
      // return response || fetch(event.request);
      if (response) {
        return response;
      }
      return fetch(event.request).then(
        (response) => {
          // Check if we received a valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = response.clone();

          caches.open(cacheStorageName)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
    .catch((error) => {
      console.warn(error + '\n Not in chache: ' + event.request.url);
      return error;
    })
  );
});
