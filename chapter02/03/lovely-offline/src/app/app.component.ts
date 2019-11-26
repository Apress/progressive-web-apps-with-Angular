import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <h1>Bind Firestore collection example</h1>
    <ul>
      <li class="text" *ngFor="let note of notes$ | async">
        {{note.title}}
      </li>
    </ul>

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lovely-offline';
  notes$: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.notes$ = db.collection('notes').valueChanges();
  }
}
