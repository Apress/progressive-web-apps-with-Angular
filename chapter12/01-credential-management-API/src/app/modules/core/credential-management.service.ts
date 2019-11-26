import { Injectable } from '@angular/core';
import { SnackBarService } from './snack-bar.service';

declare const PasswordCredential: any;
declare const FederatedCredential: any;
declare const navigator: any;
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class CredentialManagementService {
  isCredentialManagementSupported: boolean;

  constructor(private snackBar: SnackBarService) {
    if (window.PasswordCredential || window.FederatedCredential) {
      this.isCredentialManagementSupported = true;
    } else {
      this.isCredentialManagementSupported = false;
      console.log('Credential Management API is not supported in this browser');
    }
  }

  async store({ username, password }) {
    if (this.isCredentialManagementSupported) {
      // You can either pass the passwordCredentialData as below
      // or simply pass down your HTMLFormElement. A reference to an HTMLFormElement with appropriate input fields.
      // The form should, at the very least, contain an id and password.
      // It could also require a CSRF token.
      /*
        <form id="form" method="post">
          <input type="text" name="id" autocomplete="username" />
          <input type="password" name="password" autocomplete="current-password" />
          <input type="hidden" name="csrf_token" value="*****" />
        </form>
        <script>
            const form = document.querySelector('#form');
            const credential = new PasswordCredential(form);

                   const cred = new FederatedCredential({
                    id: id,
                    name: name,
                    provider: 'https://account.google.com',
                    iconURL: iconUrl
                                            });

        <script>
      */
      // Create credential object synchronously.
      const credential = new PasswordCredential({
        id: username,
        password: password
        // name: name,
        // iconURL: iconUrl
      });
      const isStored = await navigator.credentials.store(credential);
      if (isStored) {
        this.snackBar.open('You password and username saved in your browser');
      }
    }
  }

  async get() {
    if (this.isCredentialManagementSupported) {
      return navigator.credentials.get({
        password: true,
        // add mediation: 'optional' or mediation: 'required' to show the account chooser.
        // When mediation is optional, the user is explicitly shown an account chooser
        // to sign in after a navigator.credentials.preventSilentAccess() call.
        // This is normally to ensure automatic sign-in doesn't happen after the user chooses
        // to sign-out or unregister.
        mediation: 'silent'
        // federated: {
        //   providers: ['https://accounts.google.com']
        // },
      });
    }
  }

  preventSilentAccess() {
    if (this.isCredentialManagementSupported) {
      /*
        This will ensure the auto sign-in won’t happen until next time
        the user enables auto sign-in. To resume auto sign-in, a user
        can choose to intentionally sign-in by choosing the account
        they wish to sign in with, from the account chooser. Then the user
        is always signed back in until they explicitly sign out.
        */
      navigator.credentials.preventSilentAccess();
    }
  }
}
