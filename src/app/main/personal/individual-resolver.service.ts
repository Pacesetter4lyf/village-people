import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { DisplayUserModel } from './display-user.model';

import {
  IndividualService,
  respType,
} from './individual.service';
import {Individual} from './individual.model'
export const IndividualResolver: ResolveFn<Individual> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let displayUser = inject(IndividualService).displayUser.value;
  // console.log(displayUser);
  if (displayUser && displayUser._id.length > 5) {
    return displayUser;
  }
  return inject(IndividualService).fetchDisplayUser();
};


