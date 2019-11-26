import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Subject, BehaviorSubject } from "rxjs";
import { first, tap } from "rxjs/operators";

interface User {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: "root"
})
export class FirebaseAuthService {
  public authErrorMessages$ = new Subject<string>();
  public isLoading$ = new BehaviorSubject<boolean>(true);
  public user$ = new Subject<User>();

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.auth.setPersistence("local");
    this.isLoggedIn().subscribe();
  }

  private isLoggedIn() {
    return this.afAuth.authState.pipe(
      first(),
      tap(user => {
        this.isLoading$.next(false);
        if (user) {
          const { email, uid } = user;
          this.user$.next({ email, uid });
        }
      })
    );
  }

  public signUpFirebase({ email, password }) {
    this.isLoading$.next(true);
    this.handleErrorOrSuccess(() => {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    });
  }

  public loginFirebase({ email, password }) {
    this.isLoading$.next(true);
    this.handleErrorOrSuccess(() => {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    });
  }

  public logOutFirebase() {
    this.isLoading$.next(true);
    this.afAuth.auth
      .signOut()
      .then(() => {
        this.isLoading$.next(false);
        this.user$.next(null);
      })
      .catch(e => {
        console.error(e);
        this.isLoading$.next(false);
        this.authErrorMessages$.next("Something is wrong when signing out!");
      });
  }

  private handleErrorOrSuccess(
    cb: () => Promise<firebase.auth.UserCredential>
  ) {
    cb()
      .then(data => this.authenticateUser(data))
      .catch(e => this.handleSignUpLoginError(e));
  }

  private authenticateUser(UserCredential) {
    const {
      user: { email, uid }
    } = UserCredential;

    this.isLoading$.next(false);
    this.user$.next({ email, uid });
  }

  private handleSignUpLoginError(error: { code: string; message: string }) {
    this.isLoading$.next(false);
    const errorMessage = error.message;
    this.authErrorMessages$.next(errorMessage);
  }
}
