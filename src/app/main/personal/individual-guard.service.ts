import { inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  GuardsCheckEnd,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { IndividualService } from './individual.service';

export const chatGuard = () => {
  const individualService = inject(IndividualService);
  const router = inject(Router);

  return individualService.displayMode.pipe(
    switchMap((mode) => {
      if (mode !== 'self') {
        return from(router.navigate(['individual', 'basic']));
      }
      return of(true);
    })
  );
};

export const settingsGuard = () => {
  const individualService = inject(IndividualService);
  const router = inject(Router);

  const mode = individualService.displayMode.value;
  if (mode !== 'self' && mode !== 'user-viewing') {
    return router.navigate(['individual', 'basic']);
  }
  return true;
};

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
  if (page !== 'basic' && mode === 'user-creating') {
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
