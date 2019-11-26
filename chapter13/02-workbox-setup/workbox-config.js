module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    // '**/*.{js,txt,png,ico,html,css}',
    '**/favicon.ico',
    '**/index.html',
    '**/*.css',
    '**/*.js'
  ],
  globIgnores: ['stats.json'],
  globStrict: true,
  swDest: 'dist/sw.js',
  swSrc: 'src/sw-source.js',
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 // not more than 4MB
  // injectionPointRegexp: new RegExp('(const myManifest =)(;)') // just for injectManifest
  // importWorkboxFrom: 'local' // cdn, local, disabled - only supported by GenerateSW mode
  // dontCacheBustUrlsMatching,
  // modifyUrlPrefix
  // manifestTransforms
};
