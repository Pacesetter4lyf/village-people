import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { BasicDetailsInterface, IndividualService } from './individual.service';

export const IndividualResolver: ResolveFn<BasicDetailsInterface> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(IndividualService).fetchDisplayUser();
};

// resolve: {'user': () => inject(UserResolver).resolve()}.

// {
//     path: 'base'
//     canActivate: [baseGuard],
//     resolve: {data: baseDataResolver}
//     children: [
//      {
//        path: 'child',
//        canActivate: [childGuard],
//        component: ChildComponent,
//        resolve: {childData: childDataResolver}
//       }
//     ]
//    }

// (alias) type ResolveFn<T> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
// => Observable<T> | Promise<T> | T import ResolveFn
