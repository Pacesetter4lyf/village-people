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
import { ResourceService } from 'src/app/shared/modal/resource.service';
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
  resource?: {
    _id: string;
    viewableBy: string;
    description: string;
    name: string;
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


@Injectable({ providedIn: 'root' })
export class IndividualService {
  tabClickEvent = new EventEmitter<PointerEvent>();
  error = '';
  displayMode = new BehaviorSubject<
    'self' | 'admin-creating' | 'admin-viewing' | 'lineage-viewing' | 'guest'
  >('self');
  // displayUser: BasicDetailsInterface = null;
  displayUser = new BehaviorSubject<BasicDetailsInterface>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  sendBasicDetails(data: BasicDetailsInterface) {
    const basicFormData = new FormData();
    Object.keys(data).map((key) => {
      if (data[key] !== null) {
        basicFormData.append(key, data[key]);
        console.log(key, data[key]);
      }
    });

    return this.http
      .patch<respType<BasicDetailsInterface>>(
        `http://localhost:3001/api/v1/userdata/updateMe`,

        basicFormData
      )
      .subscribe((value) => {
        console.log(value);
        if (value.status === 'success') {
          this.displayUser.next(value.data.user);
        }
      });
  }

  fetchDisplayUser(userId?: string) {
    let currentId: string = userId;
    if (!userId) {
      if (this.displayUser.value) return;
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
            // this.resourceService.fetchResources();
          })
        );
    } else {
      console.log('here');
      const emptyData: BasicDetailsInterface = {
        _id: '',
        photo: '',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        phoneNumber: '',
        facebook: '',
        address: '',
        primarySchool: '',
        secondarySchool: '',
        tertiarySchool: '',
        bibliography: '',
        primary: '',
        secondary: '',
        tertiary: '',
        resource: [
          {
            _id: '',
            viewableBy: '',
            description: '',
            name: '',
            text: '',
            url: '',
            user: '',
            resourceType: '',
          },
        ],
      };
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
          data: {
            _id: '',
            photo: '',
            firstName: '',
            lastName: '',
            gender: '',
            dateOfBirth: '',
            phoneNumber: '',
            facebook: '',
            address: '',
            primarySchool: '',
            secondarySchool: '',
            tertiarySchool: '',
            bibliography: '',
            primary: '',
            secondary: '',
            tertiary: '',
            resource: [
              {
                _id: '',
                viewableBy: '',
                description: '',
                name: '',
                text: '',
                url: '',
                user: '',
                resourceType: '',
              },
            ],
          },
        },
        status: '',
      });
    }
    return throwError(() => Error(error));
  }
}
