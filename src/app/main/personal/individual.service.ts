import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Individual } from './individual.model';
import {
  catchError,
  exhaustMap,
  take,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DisplayUserModel } from './display-user.model';
export interface BasicDetailsInterface {
  _id?: string;
  photo?: string | File;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  facebook?: string;
  address?: string;
  primarySchool?: string;
  secondarySchool?: string;
  tertiarySchool?: string;
  bibliography?: string;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  createdBy?: string;
  lineage?: string[];
  adminOf?: number[];
  resource?: {
    _id?: string;
    viewableBy?: string;
    description?: string;
    name?: string;
    text?: string;
    url?: string;
    user:
      | string
      | {
          firstName: string;
          lastName: string;
        };
    resourceType: 'image' | 'text' | 'audio' | 'video' | '';
  }[];
}

export interface respType<T> {
  data: {
    data?: T;
    user?: T;
  };
  status: string;
}
type DisplayModeType =
  | 'self'
  | 'user-creating'
  | 'admin-viewing'
  | 'user-viewing'
  | 'lineage-viewing'
  | 'guest';

@Injectable({ providedIn: 'root' })
export class IndividualService {
  tabClickEvent = new EventEmitter<PointerEvent>();
  error = '';
  displayMode = new BehaviorSubject<DisplayModeType>('self');
  appendAsWhat: string;
  appendTo: string;
  displayUser = new BehaviorSubject<BasicDetailsInterface>(null);
  actualUser = new BehaviorSubject<BasicDetailsInterface>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user.subscribe((user) => {
      if (!user) {
        this.displayMode.next('self');
        this.displayUser.next(null);
        this.actualUser.next(null);
      }
    });
  }

  sendBasicDetails(data: BasicDetailsInterface) {
    const basicFormData = new FormData();
    Object.keys(data).map((key) => {
      if (data[key] !== null && data[key] !== '') {
        basicFormData.append(key, data[key]);
        console.log(key, data[key]);
      }
    });

    const displayUserId = this.displayUser.value._id;
    const displayMode = this.displayMode.value;
    if (!displayUserId) {
      // we are having an empty display user
      // determine whether in self mode or user-creating
      if (displayMode === 'self') {
        basicFormData.append('mode', 'self');
      } else {
        basicFormData.append('mode', 'other');
        basicFormData.append('appendAs', this.appendAsWhat);
        basicFormData.append('appendTo', this.appendTo);
      }
      return this.http
        .post<respType<BasicDetailsInterface>>(
          `http://localhost:3001/api/v1/userdata/createUser`,
          basicFormData
        )
        .subscribe((value) => {
          console.log(value);
          if (value.status === 'success') {
            this.displayUser.next(value.data.user);
            if (displayMode === 'self') this.actualUser.next(value.data.user);
            this.updateModeAfterCreation();
          }
        });
    }

    return this.http
      .patch<respType<BasicDetailsInterface>>(
        `http://localhost:3001/api/v1/userdata/${displayUserId}`,

        basicFormData
      )
      .subscribe((value) => {
        console.log('patch', value);
        if (value.status === 'success') {
          this.displayUser.next(value.data.user);
          if (displayMode === 'self') this.actualUser.next(value.data.user);
        }
      });
  }

  updateModeAfterCreation() {
    const mode = this.displayMode.value;
    if (mode === 'user-creating') {
      this.displayMode.next('user-viewing');
    }
  }

  fetchDisplayUser(userId?: string) {
    let currentId: string = userId;
    let self = false;
    if (!userId) {
      if (this.displayUser.value) return;
      self = true;
      this.authService.user
        .pipe(
          take(1),
          map((user) => {
            currentId = user.id;
          })
        )
        .subscribe();
    }
    console.log('is reg', this.authService.user.value.isRegistered);
    if (this.authService.user.value.isRegistered) {
      return this.http
        .get<respType<BasicDetailsInterface>>(
          `http://localhost:3001/api/v1/userdata/${currentId}`
        )
        .pipe(
          catchError(this.handleError),
          map((response) => response.data.data),
          tap<BasicDetailsInterface>((response) => {
            console.log('user ', this.displayUser);
            this.displayUser.next(response);
            if (self) this.actualUser.next(response);
            // this.resourceService.fetchResources();
          })
        );
    } else {
      console.log('here');
      const emptyData: BasicDetailsInterface = this.emptyUser();
      this.displayUser.next(emptyData);
      return of<BasicDetailsInterface>(emptyData);
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
    return new DisplayUserModel(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      [],
      '',
      '',
      '',
      []
    );
  }

  getUserWithId(id: string) {
    return this.http
      .get<respType<BasicDetailsInterface>>(
        `http://localhost:3001/api/v1/userdata/byId/${id}`
      )
      .pipe(
        catchError(this.handleError),
        map((response) => response.data.data),
        tap<BasicDetailsInterface>((response) => {
          if (!response.resource) {
            response.resource = [];
          }
          this.displayUser.next(response);
          console.log('view resp ', response);
          if (this.displayUser.value?.createdBy === this.actualUser.value._id)
            this.displayMode.next('user-viewing');
        })
      )
      .subscribe();
  }

  showDetails(id: string) {
    if (id === this.actualUser.value._id) {
      this.displayMode.next('self');
      this.displayUser = this.actualUser;
      return;
    }
    console.log('now getting user');
    this.getUserWithId(id);
    // set esit mode to false
  }
}
