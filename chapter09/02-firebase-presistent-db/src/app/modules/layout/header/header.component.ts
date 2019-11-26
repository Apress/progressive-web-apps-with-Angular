import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SnackBarService } from '../../core/snack-bar.service';
import { DataService } from '../../core/data.service';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly VAPID_PUBLIC_KEY =
    'BAwM3HXmImMMHoGE8Ketx_eqAPPbFZffgtt3_wfV035AsE9IfTcmLySQRCHNbl3sA7Eev289I8ekAJK0eW3bp58';

  public user$ = this.auth.user$;
  public subscription$ = this.swPush.subscription;
  public isEnabled = this.swPush.isEnabled;

  constructor(
    private auth: AuthService,
    private swPush: SwPush,
    private snackBar: SnackBarService,
    private dataService: DataService,
    private router: Router
  ) {
    // (<any>navigator).connection.addEventListener('change', this.onConnectionChange);

    this.swPush.messages.subscribe((msg: { notification: object }) => this.handlePushMessage(msg));

    this.swPush.notificationClicks.subscribe(options => this.handlePushNotificationClick(options));
  }

  onConnectionChange() {
    const { downlink, effectiveType, type } = (<any>navigator).connection;

    console.log(`Effective network connection type: ${effectiveType}`);
    console.log(`Downlink Speed/bandwidth estimate: ${downlink}Mb/s`);
    console.log(
      `type of connection is ${type} but could be of bluetooth, cellular, ethernet, none, wifi, wimax, other, unknown`
    );

    if (/\slow-2g|2g|3g/.test((<any>navigator).connection.effectiveType)) {
      this.snackBar.open(`You connection is slow!`);
    } else {
      this.snackBar.open(`Connection is fast!`);
    }
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
        this.snackBar.open('You are unsubscribed');
      })
      .catch(e => {
        console.error(e);
        this.snackBar.open('unsubscribe failed');
      });
  }
}
