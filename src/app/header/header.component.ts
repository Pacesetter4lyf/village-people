import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  signedIn = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authService.signedInEmitter.subscribe(
      (signedIn) => (this.signedIn = signedIn)
    );
  }
  auth() {
    if (!this.signedIn) {
      this.router.navigate(['auth']);
      return;
    }
    this.authService.signout();
    this.router.navigate(['']);
  }
}
