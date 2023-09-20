import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as adminActions from './admin.actions';
import { EMPTY, catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { respType } from 'src/app/shared/types/response.type';
import { codeRowInterface, personRowInterface } from '../admin.service';
import { environment } from 'src/environments/environment';
import { fetchNodeBegin } from '../../tree/store/tree.actions';
const apiUrl = environment.apiUrl;

@Injectable()
export class AdminEffects {
  fetchCodesBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(
        adminActions.fetchCodeBegin,
        adminActions.sendRequestToExternalSuccess
      ),
      switchMap((action) =>
        this.http.get<respType<codeRowInterface[]>>(`${apiUrl}/joincode`).pipe(
          map((resp) => {
            return adminActions.fetchCodeSuccess({
              codes: resp.data.data,
            });
          }),
          catchError((errorRes) =>
            of(
              adminActions.serverReturnsError({
                error: errorRes.error.error.message,
              })
            )
          )
        )
      )
    );
  });
  fetchMembersBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(
        adminActions.fetchMembersBegin,
        adminActions.mergeNodeSuccess,
        adminActions.changeMemberStatusSuccess
      ),
      switchMap((action) =>
        this.http
          .get<respType<personRowInterface[]>>(`${apiUrl}/userdata/members`)
          .pipe(
            map((resp) => {
              return adminActions.fetchMembersSuccess({
                members: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });
  generateCodeBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.generateCodeBegin),
      switchMap((action) =>
        this.http
          .post<respType<codeRowInterface>>(`${apiUrl}/joincode`, {
            userData: action.id,
            mode: action.joinType === 'replace' ? 'replace' : action.appendMode,
            nodeTo: action.nodeTo,
          })
          .pipe(
            map((resp) => {
              return adminActions.generateCodeSuccess({
                code: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });
  revokeCodeBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.revokeCodeBegin),
      switchMap((action) =>
        this.http
          .delete<respType<null>>(`${apiUrl}/joincode/${action.id}`)
          .pipe(
            map((resp) => {
              return adminActions.revokeCodeSuccess({
                id: action.id,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });
  mergeNodeBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.mergeNodeBegin),
      switchMap((action) =>
        this.http
          .get<respType<personRowInterface>>(
            `${apiUrl}/joincode/merge/${action.id}`
          )
          .pipe(
            map((resp) => {
              return adminActions.mergeNodeSuccess({
                id: action.id,
                newNode: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });

  findPeopleBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.findPeopleBegin),
      switchMap((action) =>
        this.http
          .get<respType<personRowInterface[]>>(
            `${apiUrl}/userdata/findpeople?lastName=${action.text}`
          )
          .pipe(
            map((resp) => {
              return adminActions.findPeopleSuccess({
                text: action.text,
                people: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });
  sendRequestToExternalBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.sendRequestToExternalBegin),
      switchMap((action) =>
        this.http
          .patch<respType<codeRowInterface[]>>(
            `${apiUrl}/joincode/${action.codeId}`,
            {
              fromId: action.nodeFrom,
              nodeTo: action.nodeTo,
              newRequest: true,
            }
          )
          .pipe(
            map((resp) => {
              console.log('srte ', resp.data.data);
              return adminActions.sendRequestToExternalSuccess({
                codeId: action.codeId,
                nodeFrom: action.nodeFrom,
                nodeTo: action.nodeTo,
                codes: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });
  seeSourceNodeBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.seeSourceNodeBegin),
      switchMap((action) =>
        this.http
          .get<respType<codeRowInterface>>(
            `${apiUrl}/joincode/code/${action.code}`
          )
          .pipe(
            map((resp) => {
              return adminActions.seeSourceNodeSuccess({
                codeRow: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          )
      )
    );
  });

  updateRequestBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.updateRequestBegin),
      switchMap((action) => {
        let payload = {
          status: action.status,
        };
        return this.http
          .patch<respType<codeRowInterface>>(
            `${apiUrl}/joincode/${action.id}`,
            payload
          )
          .pipe(
            map((resp) => {
              return adminActions.updateRequestSuccess({
                id: action.id,
                status: action.status,
                codeRow: resp.data.data,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    );
  });
  changeMembersStatusBegin = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.changeMemberStatusBegin),
      switchMap((action) => {
        return this.http
          .get<respType<'remove' | 'reinstate' | 'archive' | 'nothing'>>(
            `${apiUrl}/userdata/member/${action.id}/${action.lineage}/${action.action}`
          )
          .pipe(
            map((resp) => {
              return adminActions.changeMemberStatusSuccess({
                id: action.id,
                action: resp.data.data,
                lineage: action.lineage,
              });
            }),
            catchError((errorRes) =>
              of(
                adminActions.serverReturnsError({
                  error: errorRes.error.error.message,
                })
              )
            )
          );
      })
    );
  });
  changeMemberStatusSuccess = createEffect(() => {
    return this.action$.pipe(
      ofType(adminActions.changeMemberStatusBegin),
      withLatestFrom(this.store.select('tree')),
      switchMap(([action, tree]) => {
        if (action.id === tree.node._id) {
          return this.store
            .select('individual')
            .pipe(
              map((member) => fetchNodeBegin({ id: member.actualUser._id }))
            );
        } else {
          return EMPTY; // You can return other actions or EMPTY if no action needed
        }
      })
    );
  });
  constructor(
    private action$: Actions,
    private http: HttpClient,
    private store: Store<frmApp.AppState>
  ) {}
}
