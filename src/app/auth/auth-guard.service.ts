import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const canActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.signedIn) {
    return true;
  }
  return router.navigate(['auth']);
};
