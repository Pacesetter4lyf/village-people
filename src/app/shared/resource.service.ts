import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  Subject,
  take,
  tap,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IndividualService } from 'src/app/main/personal/individual.service';
import { Resource } from './resource.model';

import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ResourceService {
  viewingIndividual = new BehaviorSubject<boolean>(true);
  mode = new BehaviorSubject<string>('create');
  addMediaContentType = new BehaviorSubject<
    'image' | 'text' | 'audio' | 'video'
  >('image');
  showModal = new Subject<boolean>();
  emptyData: Resource = new Resource();
  resources: BehaviorSubject<Resource[]>;
  displayUserId: string;
  lineageResources: Resource[];
  userResources: Resource[];
  currentRoute: string;
  mediaEditable: boolean;

  constructor(
    private individualService: IndividualService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
    this.resources = new BehaviorSubject<Resource[]>([this.emptyData]);
  }

  getMediaEditable() {
    return this.mediaEditable;
  }

  setResource(view: 'individual' | 'lineage') {
    // determine what resource to show
    // determine whether resource can be edited or not
    // a user/admin can edit his document
    // a user cannot edit other peoples document
    // you cant edit doc from lineage
    if (view === 'lineage') {
      this.mediaEditable = false;
    } else {
      this.individualService.displayMode.pipe(take(1)).subscribe((mode) => {
        if (
          mode === 'self' ||
          mode === 'user-viewing' ||
          mode === 'user-created-not-owned'
        ) {
          this.mediaEditable = true;
        } else {
          this.mediaEditable = false;
        }
        // console.log('mode changed ', mode);
      });
      // if individual, media editable is listened to in the initialization
      this.resources.next([new Resource()]); // have something while it refreshes: optional
    }
    this.initializeResources(view);
  }

  // this block will set the resources for either the individual or lineage
  initializeResources = async (view: 'individual' | 'lineage') => {
    if (view === 'individual') {
      this.fetchUserResources().subscribe((data) => {});
      this.viewingIndividual.next(true);
    } else {
      let isRegistered: string;
      this.store
        .select('auth')
        .pipe(
          take(1),
          map((authState) => authState.user)
        )
        .subscribe((user) => (isRegistered = user.isRegistered));
      if (!isRegistered) {
        this.resources.next([this.emptyData]);
      } else if (this.lineageResources)
        this.resources.next(this.lineageResources);
      else {
        this.fetchAllResources().subscribe((response) => {
          // console.log(response);
        });
      }
      this.viewingIndividual.next(false);
    }
  };

  fetchAllResources() {
    return this.http.get<any>(`${apiUrl}/resource/`).pipe(
      take(1),
      map((resp) => resp.data.data),
      tap((resp) => {
        // console.log('response', resp);
        this.lineageResources = resp;
        this.resources.next(resp);
      })
    );
  }
  // to fetch the display user resource
  fetchUserResources() {
    // const displayUserId = this.individualService.getDisplayUser()._id;
    const userId = this.individualService.getDisplayUser()._id;
    this.displayUserId = userId;
    return this.http.get<any>(`${apiUrl}/resource/user/${userId}`).pipe(
      tap((data) => {
        this.userResources = data.data.data;
        this.resources.next(data.data.data);
      }),
      map((resp) => resp.data.data)
    );
  }

  saveResourceToDb(fileDetails: {
    description: string;
    name: string;
    file: File;
    text: string;
    resourceId?: string;
  }) {
    // const newdata = {
    //   ...fileDetails,
    //   ['user']: this.individualService.displayUser.value._id,
    //   resourceType: this.addMediaContentType.value,
    // };

    const newdata = new FormData();
    newdata.append('description', fileDetails.description);
    newdata.append('name', fileDetails.name);
    newdata.append('text', fileDetails.text);
    newdata.append('file', fileDetails.file);
    newdata.append('resourceId', fileDetails.resourceId);
    newdata.append('user', this.individualService.displayUser.value._id);
    newdata.append('resourceType', this.addMediaContentType.value);

    console.log('new data', newdata);
    if (this.mode.value === 'create') {
      return this.http
        .post<any>(
          `${apiUrl}/resource`,

          newdata
        )
        .subscribe((response) => {
          this.userResources.push(response.data.data);
          if (this.lineageResources)
            this.lineageResources.push(response.data.data);
          this.resources.next(this.userResources);
          // console.log(response);
        });
    } else {
      return this.http
        .patch<any>(
          `${apiUrl}/resource/${fileDetails.resourceId}`,

          newdata
        )
        .subscribe((response) => {
          const indexToUpdate = this.userResources.findIndex(
            (item) => item._id === fileDetails.resourceId
          );
          this.userResources[indexToUpdate] = response.data.data;
          // bad practice.
          // better to use a single resource that has all of the users and lineage
          if (this.lineageResources) {
            const indexToUpdate = this.lineageResources.findIndex(
              (item) => item._id === fileDetails.resourceId
            );
            this.lineageResources[indexToUpdate] = response.data.data;
          }
          this.resources.next(this.userResources);
          // console.log(response);
        });
    }

    //if admin-creating, get display user information and send
    //if admin viewing, get display info and send
    //if lineage, do not show edit button
  }

  deleteResource(resourceId: string) {
    return this.http
      .delete<any>(`${apiUrl}/resource/${resourceId}`)
      .subscribe((response) => {
        this.lineageResources = this.lineageResources?.filter(
          (resource) => resource._id !== resourceId
        );
        this.userResources = this.userResources.filter(
          (resource) => resource._id !== resourceId
        );
        this.resources.next(this.userResources);
      });
  }

  getDUResources(): Observable<Resource[]> {
    return this.fetchUserResources();
  }
}
