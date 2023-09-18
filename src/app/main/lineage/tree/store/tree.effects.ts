import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import * as frmApp from '../../../../store/app.reducer';
import * as TreeActions from './tree.actions';
import { respType } from 'src/app/shared/types/response.type';
import { TreeInterface, TreeModel } from '../tree.model';
import { environment } from 'src/environments/environment';
import { errorResponseFromServer } from 'src/app/main/personal/settings/store/settings.actions';
const apiUrl = environment.apiUrl;

@Injectable()
export class TreeEffects {
  beginGetUser = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.fetchNodeBegin),
      switchMap((payload) => {
        return this.http
          .get<respType<TreeModel>>(`${apiUrl}/userdata/tree/${payload.id}`)
          .pipe(
            map((res) => TreeActions.fetchNodeSuccess({ node: res.data.data })),
            catchError((errorRes) =>
              of(
                TreeActions.fetchNodeError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    )
  );
  deleteNodeBegin = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.deleteNodeBegin),
      switchMap((payload) => {
        return this.http
          .delete<respType<string>>(`${apiUrl}/userdata/${payload.id}`)
          .pipe(
            map((res) => TreeActions.deleteNodeSuccess()),
            catchError((errorRes) =>
              of(
                TreeActions.fetchNodeError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    )
  );

  deleteNodeSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.deleteNodeSuccess),
      withLatestFrom(this.store.select('individual')),
      switchMap(([payload, individual]) => {
        const id = individual.actualUser._id;
        return of(TreeActions.fetchNodeBegin({ id }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<frmApp.AppState>
  ) {}
}
