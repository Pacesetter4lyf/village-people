import { inject, Injectable } from '@angular/core';
import {
  GuardsCheckEnd,
  Router,
} from '@angular/router';
import {  take, tap } from 'rxjs/operators';
import { IndividualService } from './individual.service';

export const settingsGuard = () => {
  const individualService = inject(IndividualService);
  const router = inject(Router);

  const mode = individualService.displayMode.value;
  if (mode !== 'self' && mode !== 'user-viewing') {
    return router.navigate(['individual', 'basic']);
  }
  return true;
};

// this will ensure that the user or
// anyone cannot go to the other pages if a user is being created atm
export const IndividualGuard = () => {
  const individualService = inject(IndividualService);
  const router = inject(Router);

  let page: string;
  router.events
    .pipe(
      take(1),
      tap((event) => {
        console.log('hello ... ', event);
        if (event instanceof GuardsCheckEnd) {
          //   console.log('Clicked link:', event);
          page = event.urlAfterRedirects.split('/').pop();
        }
      })
    )
    .subscribe();
  console.log('Clicked link ', page);
  const mode = individualService.displayMode.value;
  if (
    page !== 'basic' &&
    (mode === 'user-creating' || mode === 'registering')
  ) {
    return router.navigate(['individual', 'basic']);
  }
  return true;
};

export const othersGuard = () => {
  const individualService = inject(IndividualService);
  const router = inject(Router);

  const mode = individualService.displayMode.value;
  if (mode !== 'user-viewing') {
    return true;
  }
  return router.navigate(['individual', 'basic']);
};
