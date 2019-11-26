// current workbox version
const MODULE_PATH_PREFIX = 'workbox-v3.6.3';
// to copy workbox files run npm run copyWorkboxModules or 'npx workbox copyLibraries dist'
// this synchronously load workbox
importScripts(`${MODULE_PATH_PREFIX}/workbox-sw.js`);

if (!workbox) {
  // if workbox for any resson didn't happen simply ignore the rest of file
  console.error(`Something went wrong while loading ${modulePathPrefix}/workbox-sw.js`);
} else {
  // set module path prefix
  workbox.setConfig({ modulePathPrefix: MODULE_PATH_PREFIX });

  // workbox.core.setCacheNameDetails({
  //   prefix: 'angular-aprees-note-pwa',
  //   suffix: 'v1',
  //   precache: 'install-time',
  //   runtime: 'run-time',
  //   googleAnalytics: 'ga'
  // });

  // workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

  // Modify SW update cycle
  // forces the waiting service worker to become the active service worker.
  workbox.skipWaiting();
  // ensure that updates to the underlying service worker take effect immediately for both the current client and all other active clients.
  workbox.clientsClaim();

  /* PRE-CACHE STERATEGY */

  // this is a placeholder. All assets that must be precached will be injected here automatically
  workbox.precaching.precacheAndRoute([]);

  /* RUNTIME CACHE STERATEGY */

  // we need to store our images in cache on run-time
  workbox.routing.registerRoute(
    new RegExp('/(.*)assets(.*).(?:png|gif|jpg)/'),
    // stale-while-revalidate for fonts
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        // set cache expiration restrictions to use in the strategy
        new workbox.expiration.Plugin({
          // only cache 50 requests
          maxEntries: 50,
          // only cache requests for 30 days
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );

  // we need to handle Google fonts
  workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    // stale-while-revalidate for fonts
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-apis-cache',
      plugins: [
        // set cache expiration restrictions to use in the strategy
        new workbox.expiration.Plugin({
          // only cache 50 requests
          maxEntries: 10,
          // only cache requests for 10 days
          maxAgeSeconds: 10 * 24 * 60 * 60
        })
      ]
    })
  );

  // API with network-first strategy
  workbox.routing.registerRoute(
    new RegExp('https://firestore.googleapis.com/v1beta1/(.*)'),
    workbox.strategies.networkFirst({
      cacheName: 'api-network-first',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 100
        })
      ]
    })
  );

  // API with cache-first strategy
  workbox.routing.registerRoute(
    new RegExp('https://icanhazdadjoke.com/(.*)'),
    workbox.strategies.cacheFirst({
      cacheName: 'api-cache-first',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 15 * 60 * 60 // 15 min
        })
      ]
    })
  );

  // Register navigation
  workbox.routing.registerNavigationRoute('/index.html', {
    whitelist: [new RegExp('^\\/.*$')],
    blacklist: [
      new RegExp('/restricted/(.*)'),
      new RegExp('^\\/(?:.+\\/)?[^/]*\\.[^/]*$'),
      new RegExp('^\\/(?:.+\\/)?[^/]*__[^/]*$'),
      new RegExp('^\\/(?:.+\\/)?[^/]*__[^/]*\\/.*$')
    ]
  });

  // end of 'if' for checking workbox
}
