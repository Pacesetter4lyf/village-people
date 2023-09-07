import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// import { AuthResponseData } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
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

const handleAuthentication = (responseData: AuthResponseData) => {
  const user = new User(
    responseData.data.user.email,
    responseData.data.user._id,
    responseData.token,
    new Date(responseData.expiry),
    responseData.data.user?.isRegistered
  );
  localStorage.setItem('user', JSON.stringify(user));
  return new AuthActions.Login({
    email: responseData.data.user.email,
    userId: responseData.data.user._id,
    token: responseData.token,
    expirationDate: new Date(responseData.expiry),
    isRegistered: responseData.data.user?.isRegistered,
  });
};
const handleError = (errorRes) => {
  // Handle errors here and dispatch an error action
  let error = 'An unknown error occured';
  if (!errorRes.error || !errorRes.error.message) {
    return of(new AuthActions.AuthenticateFail(error));
  }
  switch (errorRes.error.message) {
    case 'Incorrect email or password':
      error = 'Incorrect email or password';
      break;
    default:
      error = 'An unknown error occured';
  }
  return of(new AuthActions.AuthenticateFail(error));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(`${apiUrl}/users/signup`, {
            email: authData.payload.email,
            password: authData.payload.password,
          })
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(
                new Date(resData.expiry).getTime() - Date.now()
              );
            }),
            map((responseData: AuthResponseData) => {
              return handleAuthentication(responseData);
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(`${apiUrl}/users/login`, {
            email: authData.payload.email,
            password: authData.payload.password,
          })
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(
                new Date(resData.expiry).getTime() - Date.now()
              );
            }),
            map((responseData: AuthResponseData) => {
              return handleAuthentication(responseData);
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/individual']);
        })
      ),
    { dispatch: false }
  );

  redirectToAuth = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('user');
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return { type: 'DUMMY' };
        const loadedUser = new User(
          user.email,
          user.id,
          user._token,
          new Date(user._tokenExpirationDate),
          user._isRegistered
        );
        if (loadedUser.token) {
          this.authService.setLogoutTimer(
            new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
          );
          return new AuthActions.Login({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(user._tokenExpirationDate),
            isRegistered: loadedUser.isRegistered,
          });
        }
        return { type: 'DUMMY' };
      })
    )
  );

  updateLocalStorageAndLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UPDATE_REGISTRATION),
      map((authData: AuthActions.UpdateRegistration) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return { type: 'DUMMY' };
        const newUser = new User(
          user.email,
          user.id,
          user._token,
          new Date(user._tokenExpirationDate),
          authData.payload
        );
        localStorage.setItem('user', JSON.stringify(newUser));
        return new AuthActions.Login({
          email: user.email,
          userId: user.id,
          token: user._token,
          expirationDate: new Date(user._tokenExpirationDate),
          isRegistered: authData.payload,
        });
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}
}
