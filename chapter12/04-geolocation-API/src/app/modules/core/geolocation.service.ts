import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SnackBarService } from './snack-bar.service';

export interface Position {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: any;
    latitude: number;
    longitude: number;
    speed: number;
  };
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  public isGeoLocationSupported: boolean;

  private geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  };

  constructor(private snackBar: SnackBarService) {
    if (navigator.geolocation) {
      this.isGeoLocationSupported = true;
    } else {
      // geolocation is not supported, fall back to other options
      this.isGeoLocationSupported = false;
    }
  }

  getCurrentPosition(): Observable<Position> {
    return Observable.create(obs => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            obs.next(position);
            obs.complete();
          },
          error => {
            this.snackBar.open(error.message);
            obs.error(error);
          }
        );
      }
    });
  }

  watchPosition(): Observable<Position> {
    return Observable.create(obs => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          position => {
            obs.next(position);
          },
          error => {
            this.snackBar.open(error.message);
            obs.error(error);
          },
          this.geoOptions
        );
      }
    });
  }
}
