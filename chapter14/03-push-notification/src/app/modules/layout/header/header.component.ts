import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SnackBarService } from '../../core/snack-bar.service';
import { DataService } from '../../core/data.service';
import { Router } from '@angular/router';
import { SwPushService } from '../../core/push.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly VAPID_PUBLIC_KEY =
    'BAwM3HXmImMMHoGE8Ketx_eqAPPbFZffgtt3_wfV035AsE9IfTcmLySQRCHNbl3sA7Eev289I8ekAJK0eW3bp58';

  public user$ = this.auth.user$;
  public subscription$ = new Subject();
  public isEnabled;

  constructor(
    private auth: AuthService,
    private swPush: SwPushService,
    private snackBar: SnackBarService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.checkSW();
  }

  async checkSW() {
    const { isEnabled, subscription } = await this.swPush.checkSW();
    this.isEnabled = isEnabled;
    this.subscription$.next(subscription);
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
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(async (sub: PushSubscription) => {
        const subJSON = sub.toJSON();
        await this.dataService.addPushSubscription(subJSON);
        this.subscription$.next(true);
        return this.snackBar.open('You are subscribed now!');
      })
      .catch(e => {
        console.error(e);
        this.snackBar.open('Subscription failed');
      });
  }

  requestUnsubscribe() {
    this.swPush
      .unsubscribe()
      .then(() => {
        this.subscription$.next(false);
        this.snackBar.open('You are unsubscribed');
      })
      .catch(e => {
        console.error(e);
        this.snackBar.open('unsubscribe failed');
      });
  }
}
