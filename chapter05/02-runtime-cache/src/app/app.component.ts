import { Component, OnInit } from '@angular/core';
import { DataService } from './modules/core/data.service';
import { Observable } from 'rxjs';

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

  constructor(private db: DataService) {}

  ngOnInit() {
    this.joke$ = this.db.getRandomDadJoke();
  }
}
