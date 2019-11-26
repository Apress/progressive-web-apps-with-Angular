import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  window.onload = async () => {
    console.log('onload');
  };
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {
      console.log('bootstrapModule');
      // another way of registrating service worker in angular
      // if ('serviceWorker' in navigator && environment.production) {
      //   navigator.serviceWorker.register('/ngsw-worker.js') ;
      // }
    })
    .catch(err => console.log(err));
});
