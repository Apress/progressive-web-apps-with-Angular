import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './modules/core/data.service';
import { AddToHomeScreenService } from './modules/core/add-to-home-screen.service';
import { SnackBarService } from './modules/core/snack-bar.service';
import { WindowRef } from './modules/core/window-ref.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <div class="appress-pwa-note">
      <app-header></app-header>
      <div class="main">
        <div *ngIf="(joke$ | async) as joke" class="joke">😀😀 {{ joke }} 😀😀</div>
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
  isBrowser: boolean;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onEventFire(e) {
    this.a2hs.deferredPrompt = e;
  }

  constructor(
    private window: WindowRef,
    private db: DataService,
    private a2hs: AddToHomeScreenService,
    private snackBar: SnackBarService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.joke$ = this.db.getRandomDadJoke();
    if (this.isBrowser) {
      this.checkForUpdates();
    }
  }

  checkForUpdates() {
    const updateChannel = new this.window.native.BroadcastChannel('app-shell-update');
    updateChannel.addEventListener('message', event => {
      this.snackBar
        .open('Newer version of the app is available', 'Update me!', { duration: 50000000 })
        .onAction()
        .subscribe(() => {
          this.window.native.location.reload();
        });
    });
  }
}
