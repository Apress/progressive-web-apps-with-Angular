import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SnackBarService } from '../../core/snack-bar.service';
import { DataService } from '../../core/data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly VAPID_PUBLIC_KEY =
    'BAwM3HXmImMMHoGE8Ketx_eqAPPbFZffgtt3_wfV035AsE9IfTcmLySQRCHNbl3sA7Eev289I8ekAJK0eW3bp58';

  public user$ = this.auth.user$;
  public subscription$ = of(false); // this.swPush.subscription;
  public isEnabled = false; // this.swPush.isEnabled;

  constructor(
    private auth: AuthService,
    private snackBar: SnackBarService,
    private dataService: DataService,
    private router: Router
  ) {
    // this.swPush.messages.subscribe((msg: { notification: object }) => this.handlePushMessage(msg));
    // this.swPush.notificationClicks.subscribe(options => this.handlePushNotificationClick(options));
  }

  handlePushMessage({ notification }) {
    this.snackBar.open(`Push Notification: ${notification.body}`);
  }

  handlePushNotificationClick({ action, notification }) {
    switch (action) {
      case 'open': {
        this.router.navigate(['notes', notification.data.noteID, { queryParams: { pushNotification: true } }]);
        break;
      }
      case 'cancel': {
        this.snackBar.dismiss();
        break;
      }
      default: {
        this.router.navigate(['notes', notification.data.noteID, { queryParams: { pushNotification: true } }]);
        break;
      }
    }
  }

  requestPermission() {
    // this.swPush
    //   .requestSubscription({
    //     serverPublicKey: this.VAPID_PUBLIC_KEY
    //   })
    //   .then(async (sub: PushSubscription) => {
    //     const subJSON = sub.toJSON();
    //     await this.dataService.addPushSubscription(subJSON);
    //     return this.snackBar.open('You are subscribed now!');
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     this.snackBar.open('Subscription failed');
    //   });
  }

  requestUnsubscribe() {
    // this.swPush
    //   .unsubscribe()
    //   .then(() => {
    //     this.snackBar.open('You are unsubscribed');
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     this.snackBar.open('unsubscribe failed');
    //   });
  }
}
