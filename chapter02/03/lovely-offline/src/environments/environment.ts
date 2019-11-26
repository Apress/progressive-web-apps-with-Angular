// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Initialize Firebase
  firebase: {
    apiKey: "AIzaSyDRHb7TzqdBs7qxfa760wnWC1RSQZiwJzo",
    authDomain: "awesome-apress-pwa.firebaseapp.com",
    databaseURL: "https://awesome-apress-pwa.firebaseio.com",
    projectId: "awesome-apress-pwa",
    storageBucket: "awesome-apress-pwa.appspot.com",
    messagingSenderId: "950697539131"
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
