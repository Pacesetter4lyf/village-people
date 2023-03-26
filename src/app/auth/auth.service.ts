import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  signedIn = false;
  signedInEmitter = new Subject<boolean>();

  signin() {
    this.signedIn = true;
    this.signedInEmitter.next(this.signedIn);
  }
  signup() {
    this.signedIn = true;
    this.signedInEmitter.next(this.signedIn);
  }
  signout() {
    this.signedIn = false;
    this.signedInEmitter.next(this.signedIn);
  }
}
