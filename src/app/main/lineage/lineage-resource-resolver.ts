import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, of, switchMap, take } from 'rxjs';
import * as individualActions from '../personal/store/individual.actions';
import { Actions, ofType } from '@ngrx/effects';
import * as ResourceActions from 'src/app/shared/store/resource.actions';
import * as frmApp from 'src/app/store/app.reducer';

// i dont need this anymore. i fetched the resource from the component parent call
export const ResourceResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject<Store<frmApp.AppState>>(Store);
  const actions$: Actions = inject<Actions>(Actions);

  return store.select('individual').pipe(
    take(1),
    switchMap((individualData) => {
      const actualUser = individualData.actualUser;
      const id = actualUser._id;
      return store.select('resource').pipe(
        take(1),
        switchMap((resource) => {
          if (resource.lineageResource) {
            return of(true);
          } else {
            store.dispatch(ResourceActions.beginFetchLineageResource({ id }));
            return actions$.pipe(
              ofType(ResourceActions.fetchLineageResourceSuccess),
              take(1),
              map(() => true)
            );
          }
        })
      );
    })
  );
};
