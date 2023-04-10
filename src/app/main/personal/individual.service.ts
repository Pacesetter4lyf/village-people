import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Individual } from './individual.model';
import { catchError, exhaustMap, take, map, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
export interface BasicDetailsInterface {
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
}

export interface respType {
  data: {
    data: BasicDetailsInterface;
  };
  status: string;
}

@Injectable({ providedIn: 'root' })
export class IndividualService {
  tabClickEvent = new EventEmitter<PointerEvent>();
  error = '';
  displayMode: 'self' | 'admin-creating' | 'admin-viewing' | 'lineage-viewing' =
    'self';
  displayUser: BasicDetailsInterface = null;
  addMediaContentType = new BehaviorSubject<
    'image' | 'text' | 'audio' | 'video'
  >('image');

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
      .patch<any>(
        `http://localhost:3001/api/v1/userdata/updateMe`,

        basicFormData
      )
      .subscribe();
  }
  fetchDisplayUser(userId?: string) {
    let currentId: string = userId;
    if (!userId) {
      if (this.displayUser) return;
      this.authService.user
        .pipe(
          take(1),
          map((user) => {
            currentId = user.id;
          })
        )
        .subscribe();
    }
    return this.http
      .get<respType>(`http://localhost:3001/api/v1/userdata/${currentId}`)
      .pipe<BasicDetailsInterface>(
        map((response) => (this.displayUser = response.data.data))
      );
  }

  saveResourceToDb(fileDetails: {
    description: string;
    resourceName: string;
    url: string;
    text: string;
  }) {
    //if user, fetch user id and post
    if (this.displayMode === 'self') {
      const id = this.authService.user.getValue().id;
      const newdata = {
        ...fileDetails,
        ['id']: id,
        resourceType: this.addMediaContentType.value,
      };
      console.log('new data', newdata);
      return this.http
        .patch<any>(
          `http://localhost:3001/api/v1/resource/updateMe`,

          newdata
        )
        .subscribe();
    }

    //if admin-creating, get display user information and send
    //if admin viewing, get display info and send
    //if lineage, do not show edit button
  }
}
