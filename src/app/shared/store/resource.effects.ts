import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import * as ResourceActions from './resource.actions';
import { Resource } from '../resource.model';

const apiUrl = environment.apiUrl;

export interface RespType<T> {
  data: {
    data?: T;
  };
  status: string;
}

@Injectable()
export class resourceEffects {
  beginGetIndResource = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.beginFetchIndResource),
      switchMap((payload) => {
        return this.http
          .get<RespType<Resource[]>>(`${apiUrl}/resource/user/${payload.id}`)
          .pipe(
            map((responseData) => {
              return ResourceActions.fetchIndResourceSuccess({
                resource: responseData.data.data,
                id: payload.id,
              });
            }),
            catchError((errorRes) => {
              return of(
                ResourceActions.errorGettingResource({
                  error: errorRes.error.error.message,
                })
              );
            })
          );
      })
    )
  );
  beginPatchResource = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.beginPatchResource),
      switchMap((payload) => {
        return this.http
          .patch<RespType<Resource>>(
            `${apiUrl}/resource/${payload.id}`,
            payload.resource
          )
          .pipe(
            map((responseData) => {
              return ResourceActions.patchResourceSuccess({
                resource: responseData.data.data,
                id: payload.id,
              });
            }),
            catchError((errorRes) => {
              return of(
                ResourceActions.errorGettingResource({
                  error: errorRes.error.error.message,
                })
              );
            })
          );
      })
    )
  );
  beginCreateNewResource = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.beginCreateNewResource),
      switchMap((payload) => {
        return this.http
          .patch<RespType<Resource>>(`${apiUrl}/resource}`, payload.resource)
          .pipe(
            map((responseData) => {
              return ResourceActions.createNewResourceSuccess({
                resource: responseData.data.data,
              });
            }),
            catchError((errorRes) => {
              return of(
                ResourceActions.errorGettingResource({
                  error: errorRes.error.error.message,
                })
              );
            })
          );
      })
    )
  );
  beginGetLinResource = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourceActions.beginFetchLineageResource),
      switchMap((payload) => {
        return this.http
          .get<RespType<Resource[]>>(`${apiUrl}/resource/`)
          .pipe(
            map((responseData) => {
              return ResourceActions.fetchLineageResourceSuccess({
                resource: responseData.data.data,
              });
            }),
            catchError((errorRes) => {
              return of(
                ResourceActions.errorGettingResource({
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
    private router: Router
  ) {}
}
