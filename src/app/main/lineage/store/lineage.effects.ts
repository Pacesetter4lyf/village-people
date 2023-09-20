import { HttpClient, HttpParams } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, createAction, select } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as lineageActions from './lineage.actions';
import {
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { respType } from 'src/app/shared/types/response.type';
import { itemInterface } from './lineage.reducer';
import { Injectable } from '@angular/core';
import * as treeActions from '../tree/store/tree.actions';
const apiUrl = environment.apiUrl;

@Injectable()
export class LineageEffects {
  searchTextBegin = createEffect(() =>
    this.action$.pipe(
      ofType(lineageActions.searchTextBegin),
      switchMap((action) => {
        return this.http
          .get<respType<itemInterface[]>>(
            `${apiUrl}/userdata/search/${action.text}`
          )
          .pipe(
            map((resp) => {
              return lineageActions.searchTextSuccess({
                result: resp.data.data,
                for: action.for,
              });
            }),
            catchError((errorRes) =>
              of(
                lineageActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    )
  );
  getRelationshipBegin = createEffect(() =>
    this.action$.pipe(
      ofType(lineageActions.getRelationshipBegin),
      switchMap((action) => {
        return this.http
          .get<respType<string>>(
            `${apiUrl}/userdata/relationship/${action.idA}/${action.idB}`
          )
          .pipe(
            map((resp) => {
              return lineageActions.getRelationshipSuccess({
                relationship: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                lineageActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    )
  );
  linkUnlinkBegin = createEffect(() =>
    this.action$.pipe(
      ofType(lineageActions.linkUnlinkBegin),
      switchMap((action) => {
        return this.http
          .patch<respType<string>>(
            `${apiUrl}/userdata/relationship/${action.idA}/${action.idB}`,
            {
              relationship: action.relationship,
              set: action.set,
              linkNode: action.linkNode,
            }
          )
          .pipe(
            map((resp) => {
              return lineageActions.linkUnlinkSuccess({
                relationship: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                lineageActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    )
  );

  linkUnlinkSuccess = createEffect(() =>
    this.action$.pipe(
      ofType(lineageActions.linkUnlinkSuccess),
      switchMap(() =>
        combineLatest([
          this.store.select('tree'),
          this.store.select('lineage'),
        ]).pipe(
          take(1),
          map(([tree, lineage]) => {
            if (
              tree.node._id === lineage.selectedB.id ||
              tree.node._id === lineage.selectedA.id
            ) {
              return treeActions.fetchNodeBegin({ id: tree.node._id });
            } else {
              return lineageActions.dummy();
            }
          })
        )
      )
    )
  );

  memberSearchBegin = createEffect(() =>
    this.action$.pipe(
      ofType(lineageActions.searchMemberBegin),
      switchMap((action) => {
        const params = new HttpParams().set(
          'searchOutside',
          (!action.searchInside).toString()
        );
        return this.http
          .get<respType<itemInterface[]>>(
            `${apiUrl}/userdata/search/${action.text}`,
            { params }
          )
          .pipe(
            map((response) =>
              lineageActions.searchMemberSuccess({
                members: response.data.data,
              })
            ),
            catchError((errorRes) =>
              of(
                lineageActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    )
  );

  constructor(
    private http: HttpClient,
    private store: Store<frmApp.AppState>,
    private action$: Actions
  ) {}
}
