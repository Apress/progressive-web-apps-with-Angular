import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(public snackBar: MatSnackBar) {}

  open(message) {
    this.snackBar.open(message, null, {
      duration: 3500
    });
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
