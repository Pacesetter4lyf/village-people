import { Injectable } from '@angular/core';
import { User } from './user.model';
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

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // setRegistered(id: string) {
  //   const user = JSON.parse(localStorage.getItem('user'));

  //   if (!user) return;
  //   const loadedUser = new User(
  //     user.email,
  //     user.id,
  //     user._token,
  //     new Date(user._tokenExpirationDate),
  //     id //fot=r is registered id
  //   );
  //   if (loadedUser.token) {
  //     // this.user.next(loadedUser);
  //     this.store.dispatch(
  //       new AuthActions.Login({
  //         email: loadedUser.email,
  //         userId: loadedUser.id,
  //         token: loadedUser.token,
  //         expirationDate: new Date(user._tokenExpirationDate),
  //         isRegistered: loadedUser.isRegistered,
  //       })
  //     );
  //     this.setLogoutTimer(
  //       new Date(user._tokenExpirationDate).getTime() - new Date().getTime()
  //     );
  //   }
  //   localStorage.setItem('user', JSON.stringify(loadedUser));
  // }
}
