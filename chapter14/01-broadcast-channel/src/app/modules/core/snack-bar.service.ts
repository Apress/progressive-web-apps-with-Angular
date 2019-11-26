import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, SimpleSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(public snackBar: MatSnackBar) {}

  open(message, action = null, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(
      message,
      action,
      config
        ? config
        : {
            duration: 3500
          }
    );
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
