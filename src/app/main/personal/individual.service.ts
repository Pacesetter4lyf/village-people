import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Individual } from './individual.model';
import { catchError, take, map, tap, first } from 'rxjs/operators';
import { throwError, BehaviorSubject, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BasicDetailsInterface } from './individual.model';

import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/auth/store/auth.actions';
const apiUrl = environment.apiUrl;

export interface respType<T> {
  data: {
    data?: T;
    user?: T;
  };
  status: string;
}
export type DisplayModeType =
  | 'registering'
  | 'self'
  | 'user-creating'
  | 'admin-viewing'
  | 'user-viewing'
  | 'user-created-not-owned'
  | 'lineage-viewing'
  | 'guest';

@Injectable({ providedIn: 'root' })
export class IndividualService {
  tabClickEvent = new EventEmitter<PointerEvent>();
  error = '';
  displayMode = new BehaviorSubject<DisplayModeType>(null);
  appendAsWhat: string;
  appendTo: string;
  displayUser = new BehaviorSubject<Individual>(null);
  actualUser = new BehaviorSubject<Individual>(null);
  isRegistered = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {
    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        if (!user) {
          this.displayMode.next(null);
          this.displayUser.next(null);
          this.actualUser.next(null);
        } else {
          if (user.isRegistered) {
            this.displayMode.next('self');
          } else {
            this.displayMode.next('registering');
          }
        }
      });
  }

  sendBasicDetails(data: BasicDetailsInterface) {
    const basicFormData = new FormData();
    Object.keys(data).map((key) => {
      if (data[key] !== null && data[key] !== '') {
        basicFormData.append(key, data[key]);
        // console.log(key, data[key]);
      }
    });

    const displayUserId = this.displayUser.value._id;
    const displayMode = this.displayMode.value;

    if (!displayUserId) {
      // we are having an empty display user
      // determine whether in self mode or user-creating
      if (displayMode === 'self' || displayMode === 'registering') {
        basicFormData.append('mode', 'self');
      } else {
        basicFormData.append('mode', 'other');
        basicFormData.append('appendAs', this.appendAsWhat);
        basicFormData.append('appendTo', this.appendTo);
      }
      return this.http
        .post<respType<Individual>>(
          `${apiUrl}/userdata/createUser`,
          basicFormData
        )
        .subscribe((value) => {
          // console.log(value);
          if (value.status === 'success') {
            this.displayUser.next(value.data.user);
            if (displayMode === 'self') this.actualUser.next(value.data.user);
            this.updateModeAfterCreation(value.data.user);
          }
        });
    }

    return this.http
      .patch<respType<Individual>>(
        `${apiUrl}/userdata/${displayUserId}`,

        basicFormData
      )
      .subscribe((value) => {
        // console.log('patch', value);
        if (value.status === 'success') {
          this.displayUser.next(value.data.user);
          if (displayMode === 'self') this.actualUser.next(value.data.user);
          // set a global isRegistered here
        }
      });
  }

  updateModeAfterCreation(user: Individual) {
    const mode = this.displayMode.value;
    if (mode === 'user-creating') {
      this.displayMode.next('user-viewing');
    }
    if (mode === 'registering') {
      this.displayMode.next('self');
      // this.authService.setRegistered(user._id);
      this.store.dispatch(new AuthActions.UpdateRegistration(user._id));
    }
  }

  fetchDisplayUser(userId?: string) {
    let self = false;
    if (!userId) {
      if (this.displayUser.value) return; // no user id but there is already a user
      self = true;
      this.store
        .select('auth')
        .pipe(
          map((authState) => authState.user),
          take(1),
          map((user) => {
            userId = user.isRegistered;
          })
        )
        .subscribe();
    }

    if (userId) {
      return this.http
        .get<respType<Individual>>(`${apiUrl}/userdata/${userId}`)
        .pipe(
          catchError(this.handleError),
          map((response) => response.data.data),
          tap<Individual>((response) => {
            // console.log('user ', this.displayUser);
            this.displayUser.next(response);
            if (self) this.actualUser.next(response);
          })
        );
    } else {
      // console.log('here');
      const emptyData: Individual = this.emptyUser();
      this.displayUser.next(emptyData);
      return of<Individual>(emptyData);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let error = 'An unknown error occured';
    // console.log('error', errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => Error(error));
    }
    if (errorRes.statusText === 'Not Found') {
      return of({
        data: {
          data: this.emptyUser(),
        },
        status: '',
      });
    }
    return throwError(() => Error(error));
  }

  addIndividual(mode: DisplayModeType, asWhat: string, appendTo: string) {
    this.displayMode.next(mode);
    this.displayUser.next(this.emptyUser());
    this.appendAsWhat = asWhat;
    this.appendTo = appendTo;
  }

  emptyUser() {
    return new Individual();
  }

  getUserWithId(id: string) {
    return this.http
      .get<respType<BasicDetailsInterface>>(`${apiUrl}/userdata/${id}`)
      .pipe(
        catchError(this.handleError),
        map((response) => response.data.data),
        tap<Individual>((response) => {
          this.displayUser.next(response);
          // console.log('view resp ', response);
          if (this.displayUser.value?.createdBy === this.actualUser.value._id) {
            this.displayMode.next('user-viewing');
          } else {
            // check whether it is lineage viewing
            const intersect = this.displayUser.value.lineage.filter((item) =>
              this.actualUser.value.lineage.includes(item)
            );
            if (intersect.length) this.displayMode.next('lineage-viewing');
            else this.displayMode.next('guest');
            // -- if there is an intersection of lineage
            // also check whether is is public viewing
            // -- if there is no intersection
          }
        })
      )
      .subscribe();
  }

  showDetails(id: string) {
    if (id === this.actualUser.value._id) {
      this.displayMode.next('self');
      this.displayUser.next(this.actualUser.value);
      return;
    }
    // console.log('now getting user');
    this.getUserWithId(id);
    // set esit mode to false
  }

  //this will be used to get the display user
  getDisplayUser() {
    return this.displayUser.value;
  }

  switchToSelf() {
    this.displayUser.next(this.actualUser.value);
    this.displayMode.next('self');
  }
}
