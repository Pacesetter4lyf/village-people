import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export const canActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(authService.signedIn);
  return authService.user.pipe(
    map((user) => {
      return !!user;
    })
  );
  return router.navigate(['auth']);
};
