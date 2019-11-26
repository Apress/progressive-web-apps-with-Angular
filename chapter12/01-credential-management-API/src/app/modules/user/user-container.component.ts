import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { CredentialManagementService } from '../core/credential-management.service';
import { SnackBarService } from '../core/snack-bar.service';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent implements OnInit {
  public errorMessages$ = this.auth.authErrorMessages$;
  public user$ = this.auth.user$;
  public isLoading$ = this.auth.isLoading$;
  public loginForm: FormGroup;
  public hide = true;

  constructor(
    private credentialManagement: CredentialManagementService,
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit() {
    this.createLoginForm();
    if (!this.auth.authenticated) {
      this.autoSignIn();
    }
  }

  private async autoSignIn() {
    const credential = await this.credentialManagement.get();

    if (credential && credential.type === 'password') {
      const { password, id, type } = credential;
      const isLogin = await this._loginFirebase({ password, email: id });
      if (isLogin) {
        this.snackBar.open(`Signed in by ${id} automatically!`);
      }
    }
  }

  private createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public signUp() {
    this.checkFormValidity(async () => {
      const signup = await this.auth.signUpFirebase(this.loginForm.value);
      const isLogin = await this.auth.authenticateUser(signup);
      if (isLogin) {
        const { email, password } = this.loginForm.value;
        this.credentialManagement.store({ username: email, password });
      }
    });
  }

  private async _loginFirebase({ password, email }) {
    const login = await this.auth.loginFirebase({ password, email });
    const isLogin = await this.auth.authenticateUser(login);
    return isLogin;
  }

  public login() {
    this.checkFormValidity(async () => {
      const { email, password } = this.loginForm.value;
      const isLogin = this._loginFirebase({ email, password });
      if (isLogin) {
        this.credentialManagement.store({ username: email, password });
      }
    });
  }

  private checkFormValidity(cb) {
    if (this.loginForm.valid) {
      cb();
    } else {
      this.errorMessages$.next('Please enter correct Email and Password value');
    }
  }

  public logOut() {
    this.auth
      .logOutFirebase()
      .then(() => {
        this.auth.authErrorMessages$.next(null);
        this.auth.isLoading$.next(false);
        this.auth.user$.next(null);
        // prevent auto signin until next time user login explicity
        // or allow us for auto sign in
        this.credentialManagement.preventSilentAccess();
      })
      .catch(e => {
        console.error(e);
        this.auth.isLoading$.next(false);
        this.auth.authErrorMessages$.next(
          'Something is wrong when signing out!'
        );
      });
  }

  public getErrorMessage(controlName: string, errorName: string): string {
    const control = this.loginForm.get(controlName);
    return control.hasError('required')
      ? 'You must enter a value'
      : control.hasError(errorName)
      ? `Not a valid ${errorName}`
      : '';
  }
}
