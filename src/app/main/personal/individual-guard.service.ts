import { inject, Injectable } from '@angular/core';
import { GuardsCheckEnd, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

export const settingsGuard = () => {
  const router = inject(Router);
  const store = inject<Store<AppState>>(Store);

  let mode: string;
  store
    .select('individual')
    .pipe(take(1))
    .subscribe((data) => (mode = data.mode));

  if (mode !== 'self' && mode !== 'user-viewing') {
    return router.navigate(['individual', 'basic']);
  }
  return true;
};

// this will ensure that the user or
// anyone cannot go to the other pages if a user is being created atm
export const IndividualGuard = () => {
  const router = inject(Router);
  const store = inject<Store<AppState>>(Store);
  let page: string;
  router.events
    .pipe(
      take(1),
      tap((event) => {
        // console.log('hello ... ', event);
        if (event instanceof GuardsCheckEnd) {
          //   console.log('Clicked link:', event);
          page = event.urlAfterRedirects.split('/').pop();
        }
      })
    )
    .subscribe();
  console.log('Clicked link ', page);

  let mode: string;
  store
    .select('individual')
    .pipe(take(1))
    .subscribe((data) => (mode = data.mode));
  if (
    page !== 'basic' &&
    (mode === 'user-creating' || mode === 'registering')
  ) {
    return router.navigate(['individual', 'basic']);
  }
  return true;
};

export const othersGuard = () => {
  const store = inject<Store<AppState>>(Store);
  const router = inject(Router);

  let mode: string;
  store
    .select('individual')
    .pipe(take(1))
    .subscribe((data) => (mode = data.mode));
  if (mode !== 'user-viewing') {
    return true;
  }
  return router.navigate(['individual', 'basic']);
};
