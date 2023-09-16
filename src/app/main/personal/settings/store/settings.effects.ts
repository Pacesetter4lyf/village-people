import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { Individual } from '../../individual.model';
import { RespType } from '../../store/individual.effects';
import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;
import * as SettingsActions from './settings.actions';
import { respType } from 'src/app/shared/types/response.type';
import * as frmApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class settingsEffects {
  beginGetUser = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.beginGetUserFields),
      switchMap((payload) => {
        return this.http
          .get<respType<{ [key: string]: string }[]>>(
            `${apiUrl}/userdata/settings/${payload.id}`
          )
          .pipe(
            map((responseData) => {
              const actualData = responseData.data.data;
              const userFields = actualData
                .map((obj) => {
                  const [name, value] = Object.entries(obj)[0];
                  return { name, value, id: name };
                })
                .filter((item) => item.id !== 'id');
              return SettingsActions.successGetUserFields({
                userFields,
              });
            }),
            catchError((errorRes) => {
              return of(
                SettingsActions.errorResponseFromServer({
                  error: errorRes.error.error.message,
                })
              );
            })
          );
      })
    )
  );

  getResourceFields = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.getResourceFields),
      withLatestFrom(this.store.select('resource')),
      switchMap(([_, resourceData]) => {
        const resourceFields = resourceData.individualResource.map((item) => ({
          name: item.name,
          value: item.viewableBy,
          id: item._id,
          type: item.resourceType,
        }));
        return of(
          SettingsActions.setResourceFields({
            resourceFields,
          })
        );
      })
    )
  );

  beginPatchUserFields = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.beginPatchUserFields),
      switchMap((payload) => {
        return this.http
          .patch<respType<string>>(
            `${apiUrl}/userdata/settings/${payload.id}`,
            {
              [payload.name]: payload.visibility,
            }
          )
          .pipe(
            map((data) =>
              SettingsActions.successPatchUserFields({
                visibility: payload.visibility,
                name: payload.name,
                id: payload.id,
              })
            ),
            catchError((errorRes) => {
              return of(
                SettingsActions.errorResponseFromServer({
                  error: errorRes.error.error.message,
                })
              );
            })
          );
      })
    )
  );
  beginPatchResourceFields = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.beginPatchResourceFields),
      switchMap((payload) => {
        return this.http
          .patch<respType<string>>(`${apiUrl}/resource/${payload.id}`, {
            viewableBy: payload.visibility,
          })
          .pipe(
            map((data) =>
              SettingsActions.successPatchResourceFields({
                visibility: payload.visibility,
                id: payload.id,
              })
            ),
            catchError((errorRes) => {
              return of(
                SettingsActions.errorResponseFromServer({
                  error: errorRes.error.error.message,
                })
              );
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<frmApp.AppState>
  ) {}
}
