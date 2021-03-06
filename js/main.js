let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
  focusFilters();
});

// foculs first element for keyboard operation
focusFilters = () => {
  const node = document.getElementById('neighborhoods-select');
  node.focus();
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  let mapId = 'mapbox.streets';

  // let offlineLayer = L.tileLayer.offline(`https://api.tiles.mapbox.com/v4/${mapId}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}`, tilesDb, {
  //   mapboxToken: 'pk.eyJ1IjoiYmFiZWwtYmFiZWwiLCJhIjoiY2pyY2U2bzFvMDBzZzQ0cnp0azN4ZGg3MCJ9.gb6cqiIgB_zMKyHznjoHHA',
  //   maxZoom: 18,
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/" tabindex="-1">OpenStreetMap</a>',
  //   crossOrigin: true,
  //   subdomains: 'abc'
  // }).addTo(newMap);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}',  {
    mapboxToken: 'pk.eyJ1IjoiYmFiZWwtYmFiZWwiLCJhIjoiY2pyY2U2bzFvMDBzZzQ0cnp0azN4ZGg3MCJ9.gb6cqiIgB_zMKyHznjoHHA',
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/" tabindex="-1">OpenStreetMap</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  //   L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tilesDb, {
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     subdomains: 'abc',
  //     minZoom: 13,
  //     maxZoom: 19,
  //     crossOrigin: true
  // });

  updateRestaurants();

  // var offlineControl = L.control.offline(offlineLayer, tilesDb, {
  //   saveButtonHtml: '<i class="fa fa-download" aria-hidden="true"></i>',
  //   removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
  //   confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
  //     if (window.confirm('Save ' + nTilesToSave + '?')) {
  //       continueSaveTiles();
  //     }
  //   },
  //   confirmRemovalCallback: function (continueRemoveTiles) {
  //     if (window.confirm('Remove all the tiles?')) {
  //       continueRemoveTiles();
  //     }
  //   },
  //   minZoom: 13,
  //   maxZoom: 19
  // });

  // offlineControl.addTo(newMap);

  // offlineLayer.on('offline:below-min-zoom-error', function () {
  //   alert('Can not save tiles below minimum zoom level.');
  // });

  // offlineLayer.on('offline:save-start', function (data) {
  //   console.log('Saving ' + data.nTilesToSave + ' tiles.');
  // });

  // offlineLayer.on('offline:save-end', function () {
  //   alert('All the tiles were saved.');
  // });

  // offlineLayer.on('offline:save-error', function (err) {
  //   console.error('Error when saving tiles: ' + err);
  // });

  // offlineLayer.on('offline:remove-start', function () {
  //   console.log('Removing tiles.');
  // });

  // offlineLayer.on('offline:remove-end', function () {
  //   alert('All the tiles were removed.');
  // });

  // offlineLayer.on('offline:remove-error', function (err) {
  //   console.error('Error when removing tiles: ' + err);
  // });


}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.alt = restaurant.name;
  image.srcset = DBHelper.imageSrcsetForRestaurant(restaurant);
  image.sizes = '220px';
  li.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', `View details for ${restaurant.name}`);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);

    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

// offline tiles for leaflet
// https://github.com/robertomlsoares/leaflet-offline

var tilesDb = {
  getItem: function (key) {
    return localforage.getItem(key);
  },

  saveTiles: function (tileUrls) {
    var self = this;

    var promises = [];

    for (var i = 0; i < tileUrls.length; i++) {
      var tileUrl = tileUrls[i];

      (function (i, tileUrl) {
        promises[i] = new Promise(function (resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', tileUrl.url, true);
          request.responseType = 'blob';
          request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                resolve(self._saveTile(tileUrl.key, request.response));
              } else {
                reject({
                  status: request.status,
                  statusText: request.statusText
                });
              }
            }
          };
          request.send();
        });
      })(i, tileUrl);
    }

    return Promise.all(promises);
  },

  clear: function () {
    return localforage.clear();
  },

  _saveTile: function (key, value) {
    return this._removeItem(key).then(function () {
      return localforage.setItem(key, value);
    });
  },

  _removeItem: function (key) {
    return localforage.removeItem(key);
  }
};

// var offlineControl = L.control.offline(offlineLayer, tilesDb, {
//   saveButtonHtml: '<i class="fa fa-download" aria-hidden="true"></i>',
//   removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
//   confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
//       if (window.confirm('Save ' + nTilesToSave + '?')) {
//           continueSaveTiles();
//       }
//   },
//   confirmRemovalCallback: function (continueRemoveTiles) {
//       if (window.confirm('Remove all the tiles?')) {
//           continueRemoveTiles();
//       }
//   },
//   minZoom: 13,
//   maxZoom: 19
// });