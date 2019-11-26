import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="appress-pwa-note">
    <app-header></app-header>
    <div class="main"> 
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  </div>
  `,
})
export class AppComponent { }
