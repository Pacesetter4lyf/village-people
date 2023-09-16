import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Individual } from '../individual.model';
import * as IndividualActions from './individual.actions';
import { Router } from '@angular/router';

const apiUrl = environment.apiUrl;

export interface RespType<T> {
  data: {
    data?: T;
    user?: T;
  };
  status: string;
}

@Injectable()
export class individualEffects {
  beginGetUser = createEffect(() =>
    this.actions$.pipe(
      ofType(IndividualActions.beginDataFetch),
      switchMap(
        (payload: ReturnType<typeof IndividualActions.beginDataFetch>) => {
          return this.http
            .get<RespType<Individual>>(`${apiUrl}/userdata/${payload.id}`)
            .pipe(
              map((responseData) => {
                if (payload.isSelf) {
                  return IndividualActions.actualUserFetchSuccess({
                    individual: responseData.data.data,
                  });
                } else {
                  return IndividualActions.displayUserFetchSuccess({
                    individual: responseData.data.data,
                  });
                }
              }),
              catchError((errorRes) => {
                return of(
                  IndividualActions.errorGettingUser({
                    error: errorRes.error.error.message,
                  })
                );
              })
            );
        }
      )
    )
  );

  BeginCreateUser = createEffect(() =>
    this.actions$.pipe(
      ofType(IndividualActions.BEGIN_CREATE_USER),
      switchMap(
        (props: ReturnType<typeof IndividualActions.beginCreateUser>) => {
          return this.http
            .post<RespType<Individual>>(
              `${apiUrl}/userdata/createUser`,
              props.individual
            )
            .pipe(
              map((response) => {
                if (props.isSelf) {
                  return IndividualActions.createSelfSuccess({
                    individual: response.data.user,
                  });
                } else {
                  return IndividualActions.createAppendSuccess({
                    individual: response.data.user,
                  });
                }
              }),
              catchError((errorRes) => {
                return of(
                  IndividualActions.setErrorMessage({
                    error: errorRes as string,
                  })
                );
              })
            );
        }
      )
    )
  );
  BeginPatchUser = createEffect(() =>
    this.actions$.pipe(
      ofType(IndividualActions.BEGIN_PATCH_USER),
      switchMap(
        (props: ReturnType<typeof IndividualActions.beginPatchUser>) => {
          return this.http
            .patch<RespType<Individual>>(
              `${apiUrl}/userdata/${props.id}`,
              props.individual
            )
            .pipe(
              map((response) => {
                if (props.isSelf) {
                  return IndividualActions.patchSelfSuccess({
                    individual: response.data.user,
                  });
                } else {
                  return IndividualActions.patchOthersSuccess({
                    individual: response.data.user,
                  });
                }
              }),
              catchError((errorRes) => {
                return of(
                  IndividualActions.setErrorMessage({
                    error: errorRes as string,
                  })
                );
              })
            );
        }
      )
    )
  );
  beginAppendMember = createEffect(() =>
    this.actions$.pipe(
      ofType(IndividualActions.BEGIN_APPEND_MEMBER),
      tap(() => {
        this.router.navigate(['/individual']);
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
