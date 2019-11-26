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

  // Modify SW update cycle
  workbox.skipWaiting();
  workbox.clientsClaim();

  /* PRE-CACHE STERATEGY */

  // this is a placeholder. app-shell will be injected here automatically
  workbox.precaching.precacheAndRoute([]);

  // BROADCAST UPDATE

  // Registering a broadcast update plugin for prechache asset
  workbox.precaching.addPlugins([new workbox.broadcastUpdate.Plugin('app-shell-update')]);

  /* RUNTIME CACHE STERATEGY */

  // we need to store our images in cache on run-time
  workbox.routing.registerRoute(
    new RegExp('/(.*)assets(.*).(?:png|gif|jpg)/'),
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
        })
      ]
    })
  );

  // first think first, we need to handle Google fonts
  workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-apis-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 10,
          maxAgeSeconds: 10 * 24 * 60 * 60 // 10 Days
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

  // BACKGROUND_SYNC
  // Register saveNote Endpoint with method POST for background sync
  workbox.routing.registerRoute(
    new RegExp('/api/saveNote'),
    workbox.strategies.networkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin('firebaseSaveNoteQueue', {
          callbacks: {
            queueDidReplay: StorableRequest => {
              // Invoked after all requests in the queue have successfully replayed.
              console.log('queueDidReplay', StorableRequest);
              self.registration.showNotification('Background Sync Successful', {
                body: 'You notes has been updated after you came back online! 🎉`🎉`🎉`'
              });
            },
            requestWillEnqueue: StorableRequest => {
              // Invoked immediately before the request is stored to IndexedDB. Use this callback to modify request data at store time.
              console.log('requestWillEnqueue', StorableRequest);
            },
            requestWillReplay: StorableRequest => {
              // Invoked immediately before the request is re-fetched. Use this callback to modify request data at fetch time.
              console.log('requestWillEnqueue', StorableRequest);
            }
          },
          maxRetentionTime: 60 * 24 * 7 // 7 days in minutes
        })
      ]
    }),
    'POST'
  );

  workbox.routing.registerRoute(
    new RegExp('/api/deleteNote/(.*)'),
    workbox.strategies.networkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin('firebaseDeleteNoteQueue', {
          callbacks: {
            queueDidReplay: _ => {
              self.registration.showNotification('Background Sync Successful', {
                body: 'DELETE is done! 🎉`🎉`🎉`'
              });
            }
          },
          maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
        })
      ]
    }),
    'DELETE'
  );

  // OFFLINE ANALYTICS
  /*
    workbox.googleAnalytics.initialize({
      parameterOverrides: {
        networkstatus: 'offline'
      }
    });
  */
  // end of 'if' for checking workbox
}
