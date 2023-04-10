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
  if (inject(IndividualService).displayUser)
    return inject(IndividualService).displayUser;
  return inject(IndividualService).fetchDisplayUser();
};
