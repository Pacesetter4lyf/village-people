import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take, switchMap, of, map } from 'rxjs';

import * as frmApp from 'src/app/store/app.reducer';
import * as TreeActions from './tree/store/tree.actions';

export const TreeResolver: ResolveFn<boolean> = () => {
  const store = inject<Store<frmApp.AppState>>(Store);
  const actions$: Actions = inject<Actions>(Actions);

  return store.select('individual').pipe(
    take(1),
    switchMap((data) => {
      const id = data.actualUser._id;
      return store.select('tree').pipe(
        take(1),
        switchMap((tree) => {
          if (!tree.node) {
            store.dispatch(TreeActions.fetchNodeBegin({ id }));
            return actions$.pipe(
              ofType(TreeActions.fetchNodeSuccess),
              take(1),
              map(() => true)
            );
          }
          return of(true);
        })
      );
    })
  );

  // return store.select('tree').pipe(
  //   take(1),
  //   switchMap((tree) => {
  //     if(!tree.node){
  //         store.dispatch(fetchNodeBegin({id: 'jjk'}))
  //     }
  //     const displayUser = individualData.displayUser;
  //     const id = displayUser._id;
  //     return store.select('resource').pipe(
  //       take(1),
  //       switchMap((resource) => {
  //         if (resource.userId === id) {
  //           return of(true);
  //         } else {
  //           store.dispatch(ResourceActions.beginFetchIndResource({ id }));
  //           return actions$.pipe(
  //             ofType(ResourceActions.fetchIndResourceSuccess),
  //             take(1),
  //             map(() => true)
  //           );
  //         }
  //       })
  //     );
  //   })
  // );
};
