import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(public snackBar: MatSnackBar) {}

  action(message, buttonTitle) {
    return this.snackBar.open(message, buttonTitle, { duration: 1500000 }).onAction();
  }

  open(message, duration?) {
    this.snackBar.open(message, null, {
      duration: duration ? duration : 3500
    });
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
