import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { DataService } from './modules/core/data.service';
import { AddToHomeScreenService } from './modules/core/add-to-home-screen.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
  <div class="appress-pwa-note">
    <app-header></app-header>
    <div class="main">
      <div *ngIf="joke$ | async as joke" class="joke">
      😀😀 {{ joke }} 😀😀
      </div>
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  </div>
  `,
  styles: [
    `
      .joke {
        margin-top: 0.5rem;
        padding: 1rem;
        border: 1px solid #ccc;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  joke$: Observable<string>;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onEventFire(e) {
    this.a2hs.deferredPrompt = e;
  }

  constructor(private db: DataService, private a2hs: AddToHomeScreenService) {}

  ngOnInit() {
    this.joke$ = this.db.getRandomDadJoke();
  }
}
