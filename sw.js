var cacheStorageName = 'restaurant-v2';
var cacheImgName = 'restaurant-tiles-mapbox-v2';

var allCaches = [
  cacheStorageName,
  cacheImgName
];

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
          return cacheName.startsWith('restaurant-') &&
            !allCaches.includes(cacheName);
          //cacheName != cacheStorageName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.host === 'api.tiles.mapbox.com') {
    event.respondWith(serveTiles(event.request));
    return;
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // return response || fetch(event.request);
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = response.clone();

          caches.open(cacheStorageName).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch((error) => {
        console.warn(error + '\n Not in chache: ' + event.request.url);
        return error;
      })
    );

  }
});


function serveTiles(request) {
  // Tile urls look like:
  // https://api.tiles.mapbox.com/v4/mapbox.streets/13/2410/3079.jpg70?access_token=pk.eyJ1IjoiYmFiZWwtYmFiZ...
  // But storageUrl has the 70?access_token=* part missing.
  // this url is used to store & match the image in the cache.
  // This means I only store one copy of each tile.

  // var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');
  var storageUrl = request.url.split("70?access_token=")[0];

  // return images from the cache
  // if they're in there. Otherwise, fetch the images from
  // the network, put them into the cache, and send it back
  // to the browser.

  return caches.open(cacheImgName).then(function(cache) {
    return cache.match(storageUrl).then(function(resp) {
      //if tile is in cache, return jpg from cache
      if (resp) return resp;

      // otherwise request it from network
      return fetch(request).then(function(networkResp) {
        // cache.put supports a plain url as the first parameter
        // and clone one copy to the cache
        cache.put(storageUrl, networkResp.clone());
        return networkResp;
      });
    }).catch((err) => {
      console.warn('Map tile not in cache: ' + storageUrl + '\n' + err);
      // return err;
    });
  });
}