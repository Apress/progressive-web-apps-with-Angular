import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  template: `
    <div style="margin-top:3rem; text-align: center">
      <h1>WELCOME TO APRESS PWA NOTE!</h1>
    </div>
  `
})
export class HomePageComponent {
  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.authenticated) {
      this.router.navigateByUrl('/notes');
    }
  }
}
