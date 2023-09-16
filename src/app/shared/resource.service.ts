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
  ) {
    this.resources = new BehaviorSubject<Resource[]>([this.emptyData]);
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
    return null;
  }
}
