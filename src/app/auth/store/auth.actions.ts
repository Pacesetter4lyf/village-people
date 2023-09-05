import { Action } from '@ngrx/store';

export const LOGIN = '[auth] Login';
export const LOGOUT = '[auth] Logout';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      isRegistered: string;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;
