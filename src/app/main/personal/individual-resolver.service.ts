import { Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import * as fromApp from 'src/app/store/app.reducer';
import { IndividualService } from './individual.service';
import { Individual } from './individual.model';
import { Store } from '@ngrx/store';
import { catchError, delay, map, of, switchMap, take, tap } from 'rxjs';
import * as individualActions from './store/individual.actions';
import * as ResourceActions from 'src/app/shared/store/resource.actions';
import * as SettingsActions from '../personal/settings/store/settings.actions';

export const IndividualResolver: ResolveFn<boolean> = () => {
  const store = inject<Store<fromApp.AppState>>(Store);
  const actions$: Actions = inject<Actions>(Actions);

  return store.select('individual').pipe(
    take(1),
    switchMap((individualData) => {
      const actualUser = individualData.actualUser;
      if (actualUser) {
        return of(true);
      } else {
        return store.select('auth').pipe(
          take(1),
          switchMap((auth) => {
            const id = auth.user.isRegistered;
            if (id) {
              store.dispatch(
                individualActions.beginDataFetch({ id, isSelf: true })
              );
              return actions$.pipe(
                ofType(individualActions.actualUserFetchSuccess),
                take(1),
                map(() => true)
              );
            } else {
              store.dispatch(
                individualActions.changeMode({ mode: 'registering' })
              );
              return actions$.pipe(
                ofType(individualActions.changeMode),
                take(1),
                map(() => true)
              );
            }
          })
        );
      }
    })
  );
};

export const ResourceResolver: ResolveFn<boolean> = () => {
  const store = inject<Store<fromApp.AppState>>(Store);
  const actions$: Actions = inject<Actions>(Actions);

  return store.select('individual').pipe(
    take(1),
    switchMap((individualData) => {
      const displayUser = individualData.displayUser;
      const id = displayUser._id;
      return store.select('resource').pipe(
        take(1),
        switchMap((resource) => {
          if (resource.userId === id) {
            return of(true);
          } else {
            store.dispatch(ResourceActions.beginFetchIndResource({ id }));
            return actions$.pipe(
              ofType(ResourceActions.fetchIndResourceSuccess),
              take(1),
              map(() => true)
            );
          }
        })
      );
    })
  );
};

export const SettingsResolver: ResolveFn<boolean> = () => {
  const store = inject<Store<fromApp.AppState>>(Store);
  const actions$: Actions = inject<Actions>(Actions);

  // will get/set the userfields and will also get the individual resource
  // if no individual resource, it fetches it then sets the resourceFields
  return store.select('individual').pipe(
    take(1),
    switchMap((individualData) => {
      const displayUser = individualData.displayUser;
      const id = displayUser._id;
      return store.select('resource').pipe(
        take(1),
        switchMap((resource) => {
          if (!resource.individualResource || resource.userId !== id) {
            store.dispatch(ResourceActions.beginFetchIndResource({ id }));
            return actions$.pipe(
              ofType(ResourceActions.fetchIndResourceSuccess),
              take(1),
              switchMap((resource) => {
                store.dispatch(SettingsActions.getResourceFields());
                return of(true);
              })
            );
          } else {
            store.dispatch(SettingsActions.getResourceFields());
            return of(true);
          }
        }),
        switchMap(() => {
          return store.select('settings').pipe(
            take(1),
            switchMap((settingsData) => {
              if (!settingsData.userFields) {
                store.dispatch(SettingsActions.beginGetUserFields({ id }));
                return actions$.pipe(
                  ofType(SettingsActions.successGetUserFields),
                  take(1),
                  map(() => true)
                );
              } else {
                return of(true);
              }
            })
          );
        })
      );
    })
  );
};
