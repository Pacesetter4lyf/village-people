import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import {
  BasicDetailsInterface,
  IndividualService,
  respType,
} from './individual.service';

export const IndividualResolver: ResolveFn<BasicDetailsInterface> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let displayUser = inject(IndividualService).displayUser.value;
  console.log(displayUser);
  if (displayUser && displayUser._id.length > 5) {
    return displayUser;
  }
  return inject(IndividualService).fetchDisplayUser();
};
