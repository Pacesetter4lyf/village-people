import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Individual } from './individual.model';
import { catchError, exhaustMap, take, map } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
export interface BasicDetailsInterface {
  photo: string | File;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  facebook: string;
  address?: string;

  primarySchool?: string;
  secondarySchool?: string;
  tertiarySchool?: string;
  bibliography?: string;
}

@Injectable({ providedIn: 'root' })
export class IndividualService {
  tabClickEvent = new EventEmitter<PointerEvent>();
  error = '';
  displayMode: 'user' | 'admin' | 'guest' = 'user';
  displayUser: BasicDetailsInterface = null;
  displayUserChange = new Subject<string>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBasicData(id: string) {
    return this.http.get<any>(`http://localhost:3001/api/v1/users/data${id}`);
    // .subscribe((data) => console.log(data));
  }
  sendBasicDetails(data: BasicDetailsInterface) {
    const basicFormData = new FormData();
    Object.keys(data).map((key) => {
      if (data[key] !== null) {
        basicFormData.append(key, data[key]);
        console.log(key, data[key]);
      }
    });

    return this.http.patch<any>(
      `http://localhost:3001/api/v1/userdata/updateMe`,

      basicFormData
    );
  }
  fetchDisplayUser(userId?: string) {
    let currentId: string = userId;
    if (!userId) {
      if (this.displayUser) return;
      this.authService.user.pipe(
        take(1),
        map((user) => (currentId = user.id))
      );
    }
    return this.http
      .get<any>(`http://localhost:3001/api/v1/users/data${userId}`)

      .subscribe((newUser) => {
        console.log(newUser);
        this.displayUser = newUser;
      });
  }
}
