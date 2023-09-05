import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  signedIn = false;
  private userSub: Subscription;

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit() {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.signedIn = !!user;
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
    this.store.dispatch(new AuthActions.Logout());
  }
}
