import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { DataService } from '../../core/data.service';
import { SnackBarService } from '../../core/snack-bar.service';
import { GeolocationService, Position } from '../../core/geolocation.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notes-add',
  templateUrl: './notes-add.component.html',
  styleUrls: ['./notes-add.component.scss']
})
export class NotesAddComponent {
  public userID;
  public errorMessages$ = new Subject();
  public loading$ = new Subject();
  public isGeoLocationSupported = this.geoLocation.isGeoLocationSupported;
  public location$: Observable<string> = this.geoLocation
    .getCurrentPosition()
    .pipe(map(p => `Latitude:${p.coords.latitude} Longitude:${p.coords.longitude}`));

  constructor(
    private router: Router,
    private data: DataService,
    private snackBar: SnackBarService,
    private geoLocation: GeolocationService
  ) {}

  onSaveNote(values) {
    this.data.addNote(values).then(
      doc => {
        this.snackBar.open(`LOCAL: ${doc.id} has been succeffully saved`);
      },
      e => {
        this.errorMessages$.next('something is wrong when adding to DB');
      }
    );
    this.router.navigate(['/notes']);
  }

  onSendError(message) {
    this.errorMessages$.next(message);
  }
}
