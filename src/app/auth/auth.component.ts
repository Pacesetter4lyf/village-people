import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  signup = false;
  constructor(private router: Router, private authService: AuthService) {}

  auth() {
    if (this.signup) {
      //signup is enabled
      this.authService.signup();
    } else {
      // signup is disabled
      this.authService.signin();
    }

    this.router.navigate(['individual']);
  }
}
