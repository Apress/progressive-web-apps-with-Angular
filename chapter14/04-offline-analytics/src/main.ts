import { enableProdMode, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { filter, take } from 'rxjs/operators';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const module = await platformBrowserDynamic().bootstrapModule(AppModule);
    const app = module.injector.get(ApplicationRef);
    const whenStable = await app.isStable
      .pipe(
        filter((stable: boolean) => !!stable),
        take(1)
      )
      .toPromise();
    // Use the window load event to keep the page load performant
    window.onload = async () => {
      // register service worker which has been created by Workbox
      // 1- Angular boostrap is stable
      // 2- service worker is supported
      // 3- just register for production
      if (whenStable && navigator.serviceWorker && environment.production) {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log(`scope is: ${registration.scope}`);
      }
    };
  } catch (err) {
    console.error(err);
  }
});
