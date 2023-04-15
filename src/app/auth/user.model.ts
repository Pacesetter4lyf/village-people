import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _isRegistered?: boolean
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    return this._token;
  }
  get isRegistered() {
    return this._isRegistered;
  }
}
