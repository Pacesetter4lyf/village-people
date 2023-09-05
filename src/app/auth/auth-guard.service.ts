import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

export const canActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select('auth').pipe(
    take(1),
    map((authState) => authState.user),
    map((user) => {
      const isAuth = !!user;
      if (isAuth) return true;
      return router.navigate(['auth']);
    })
  );
};
