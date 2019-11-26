import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { FirebaseAuthService } from "../core/firebaseAuth.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-user-container",
  templateUrl: "./user-container.component.html",
  styleUrls: ["./user-container.component.scss"]
})
export class UserContainerComponent implements OnInit {
  public errorMessages$ = this.afAuthService.authErrorMessages$;
  public user$ = this.afAuthService.user$;
  public isLoading$ = this.afAuthService.isLoading$;
  public loginForm: FormGroup;
  public hide = true;

  constructor(
    private fb: FormBuilder,
    private afAuthService: FirebaseAuthService
  ) {}

  ngOnInit() {
    this.createLoginForm();
  }

  private createLoginForm() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  public signUp() {
    this.checkFormValidity(() => {
      this.afAuthService.signUpFirebase(this.loginForm.value);
    });
  }

  public login() {
    this.checkFormValidity(() => {
      this.afAuthService.loginFirebase(this.loginForm.value);
    });
  }

  private checkFormValidity(cb) {
    if (this.loginForm.valid) {
      cb();
    } else {
      this.errorMessages$.next("Please enter correct Email and Password value");
    }
  }

  public logOut() {
    this.afAuthService.logOutFirebase();
  }

  public getErrorMessage(controlName: string, errorName: string): string {
    const control = this.loginForm.get(controlName);
    return control.hasError("required")
      ? "You must enter a value"
      : control.hasError(errorName)
        ? `Not a valid ${errorName}`
        : "";
  }
}
