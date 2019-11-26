import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.createLoginForm();
  }

  private createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public signUp() {
    this.checkFormValidity(() => {
      this.auth.signUpFirebase(this.loginForm.value);
    });
  }

  public login() {
    this.checkFormValidity(() => {
      this.auth.loginFirebase(this.loginForm.value);
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
