import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  signedIn = false;
  private userSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.signedIn = !!user;
      console.log('si', this.signedIn, user);
    });
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  auth() {
    if (!this.signedIn) {
      this.router.navigate(['auth']);
      return;
    }
    this.authService.signout();
  }
}
