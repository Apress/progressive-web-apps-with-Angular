//   6. Generic fallback
self.addEventListener("fetch", event => {
  const request = event.request;
  event.respondWith(
    // check with cache first
    caches
      .match(request)
      .then(res => {
        // Fall back to network and if both failes catch error
        return res || fetch(request);
      })
      .catch(() => {
        // If both fail, show a generic fallback:
        return caches.match("/offline.html");
      })
  );
});

//   5. Cache and Network

/*
const hasFetchData = false;
// fetch fresh data
const freshDataFromNetwork = fetch(YOUR_API)
.then((response) => response.json())
.then((data) => {
  hasFetchData = true;
  showDataInPage();
});

// fetch cached data
caches.match(YOUR_API)
.then((response) => response.json())
.then(function(data) {
  if (!hasFetchData) {
    showDataInPage(data);
  }
}).catch((e)=> freshDataFromNetwork)
*/

self.addEventListener("fetch", event => {
  const request = event.request;
  event.respondWith(
    caches.open(DYNAMIC_CACHE_VERSION).then(cache => {
      return fetch(request).then(res => {
        cache.put(request, res.clone());
        return res;
      });
    })
  );
});

//   4. Network first, falling back to cache
self.addEventListener("fetch", event => {
  const request = event.request;
  event.respondWith(
    fetch(request)
      .then(res => {
        // Cache latest version
        caches
          .open(DYNAMIC_CACHE_VERSION)
          .then(cache => cache.put(request, res));
        return res.clone();
      }) // Fallback to cache
      .catch(err => caches.match(request))
  );
});

//   3. Cache first, falling back to network
self.addEventListener("fetch", event => {
  const request = event.request;
  event.respondWith(
    caches.match(request).then(res => {
      // Fallback
      return (
        res ||
        fetch(request).then(newRes => {
          // Cache fetched response
          caches
            .open(DYNAMIC_CACHE_VERSION)
            .then(cache => cache.put(request, newRes));
          return newRes.clone();
        })
      );
    })
  );
});

//   2. Network Only
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});

//   1. Cache only
self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request));
});
