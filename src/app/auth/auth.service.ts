import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

const apiUrl = environment.apiUrl;
export interface AuthResponseData {
  status: string;
  token: string;
  expiry: string;
  data: {
    user: {
      photo: string;
      role: 'user' | 'admin';
      _id: string;
      email: string;
      __v?: number;
      isRegistered?: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${apiUrl}/users/login`, {
        email,
        password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          console.log('res data ', resData);
          this.handleAuthentication(
            resData.data.user.email,
            resData.data.user._id,
            resData.token,
            new Date(resData.expiry),
            resData.data.user.isRegistered
          );
        })
      );
  }
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${apiUrl}/users/signup`, {
        email,
        password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) =>
          this.handleAuthentication(
            resData.data.user.email,
            resData.data.user._id,
            resData.token,
            new Date(resData.expiry),
            resData.data.user.isRegistered
          )
        )
      );
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiration: Date,
    isRegistered: string
  ) {
    const user = new User(email, id, token, expiration, isRegistered);
    // this.user.next(user);
    this.store.dispatch(
      new AuthActions.Login({
        email: user.email,
        userId: user.id,
        token: user.token,
        expirationDate: expiration,
        isRegistered: user.isRegistered,
      })
    );
    this.autoLogout(expiration.getTime() - new Date().getTime());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let error = 'An unknown error occured';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => Error(error));
    }
    switch (errorRes.error.error.message) {
      case 'Incorrect email or password':
        error = 'Incorrect email or password';
        break;
      default:
        error = 'An unknown error occured';
    }
    return throwError(() => Error(error));
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      new Date(user._tokenExpirationDate),
      user._isRegistered
    );
    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(
        new AuthActions.Login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(user._tokenExpirationDate),
          isRegistered: loadedUser.isRegistered,
        })
      );
      this.autoLogout(
        new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
      );
    }
  }
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signout();
      console.log('logging out');
    }, expirationDuration);
  }
  signout() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    console.log('authing');
    this.router.navigate(['auth']);
  }

  setRegistered(id: string) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) return;
    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      new Date(user._tokenExpirationDate),
      id
    );
    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(
        new AuthActions.Login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(user._tokenExpirationDate),
          isRegistered: loadedUser.isRegistered,
        })
      );
      this.autoLogout(
        new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
      );
    }
    localStorage.setItem('user', JSON.stringify(loadedUser));
  }
}
