import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from './user.model';
import { Route, Router } from '@angular/router';

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
    };
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  signedIn = true;
  signedInEmitter = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:3001/api/v1/users/login', {
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
            new Date(resData.expiry)
          )
        )
      );
  }
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:3001/api/v1/users/signup', {
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
            new Date(resData.expiry)
          )
        )
      );
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiration: Date
  ) {
    const user = new User(email, id, token, expiration);
    this.user.next(user);
    this.autoLogout(expiration.getTime() - new Date().getTime());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let error = 'An unknown error occured';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => Error(error));
    }
    switch (errorRes.error.error.message) {
      case 'xx':
        error = 'xx';
        break;
      case 'yy':
        error = '';
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
      new Date(user._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
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
    this.user.next(null);
    this.router.navigate(['']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['auth']);
  }
}
