import { Action } from '@ngrx/store';

export const AUTO_LOGIN = '[auth] Auto Login';
export const SIGNUP_START = '[auth] Signup Start';
export const LOGIN_START = '[auth] Login Start';
export const AUTHENTICATE_FAIL = '[auth] Login Fail';
export const AUTHENTICATE_SUCCESS = '[auth] Login';
export const LOGOUT = '[auth] Logout';
export const UPDATE_REGISTRATION = '[auth] Update Registration';

export class Login implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

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
export class UpdateRegistration implements Action {
  readonly type = UPDATE_REGISTRATION;
  constructor(public payload: string) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}
export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}
export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string; password: string }) {}
}

export type AuthActions =
  | AutoLogin
  | Login
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | UpdateRegistration
