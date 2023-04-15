import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Subject, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {
  BasicDetailsInterface,
  IndividualService,
} from 'src/app/main/personal/individual.service';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  viewingIndividual = new BehaviorSubject<boolean>(true);
  mode = new BehaviorSubject<string>('create');
  addMediaContentType = new BehaviorSubject<
    'image' | 'text' | 'audio' | 'video'
  >('image');
  showModal = new Subject<boolean>();
  emptyData: BasicDetailsInterface['resource'][0] = {
    _id: '',
    viewableBy: '',
    description: '',
    name: '',
    text: '',
    url: '',
    user: '',
    resourceType: '',
  };
  resources: BehaviorSubject<BasicDetailsInterface['resource']>;
  lineageResources: BasicDetailsInterface['resource'];

  constructor(
    private individualService: IndividualService,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.resources = new BehaviorSubject<BasicDetailsInterface['resource']>([
      this.emptyData,
    ]);
  }

  initializeResources = async (view: 'individual' | 'lineage') => {
    if (view === 'individual') {
      this.resources.next(this.individualService.displayUser.value.resource);

      this.viewingIndividual.next(true);
    } else {
      if (!this.authService.user.value.isRegistered) {
        this.resources.next([this.emptyData]);
      } else if (this.lineageResources)
        this.resources.next(this.lineageResources);
      else {
        this.fetchAllResources().subscribe((response) => {
          this.resources.next(response);
          console.log(response);
        });
      }
      this.viewingIndividual.next(false);
    }
  };

  fetchAllResources() {
    return this.http.get<any>(`http://localhost:3001/api/v1/resource/`).pipe(
      take(1),
      map((resp) => resp.data.data),
      tap((resp) => {
        console.log('response', resp);
        this.lineageResources = resp;
      })
    );
  }
  fetchResources() {
    return this.http
      .get<any>(
        `http://localhost:3001/api/v1/resource/${this.individualService.displayUser.value._id}`
      )
      .subscribe((data) => console.log(data));
  }
  changeResources() {}
  saveResourceToDb(fileDetails: {
    description: string;
    name: string;
    url: string;
    text: string;
    resourceId?: string;
  }) {
    const newdata = {
      ...fileDetails,
      ['user']: this.individualService.displayUser.value._id,
      resourceType: this.addMediaContentType.value,
    };
    console.log('new data', newdata);
    if (this.mode.value === 'create') {
      return this.http
        .post<any>(
          `http://localhost:3001/api/v1/resource`,

          newdata
        )
        .subscribe((response) => {
          let displayUser = this.individualService.displayUser.getValue();
          console.log('du ', displayUser)
          displayUser.resource.push(response.data.data);
          this.individualService.displayUser.next(displayUser);
          this.resources.next(displayUser.resource);
          console.log(response);
        });
    } else {
      return this.http
        .patch<any>(
          `http://localhost:3001/api/v1/resource/${fileDetails.resourceId}`,

          newdata
        )
        .subscribe((response) => {
          let displayUser = this.individualService.displayUser.getValue();
          let resources = displayUser.resource;
          resources = resources.map((resource) =>
            resource._id !== response.data.data._id
              ? resource
              : response.data.data
          );
          displayUser.resource = resources;
          this.individualService.displayUser.next(displayUser);
          this.resources.next(resources);
          console.log(response);
        });
    }

    //if admin-creating, get display user information and send
    //if admin viewing, get display info and send
    //if lineage, do not show edit button
  }

  deleteResource(resourceId: string) {
    return this.http
      .delete<any>(`http://localhost:3001/api/v1/resource/${resourceId}`)
      .subscribe((response) => {
        let displayUser = this.individualService.displayUser.getValue();
        let resources = displayUser.resource;
        resources = resources.filter((resource) => resource._id !== resourceId);
        displayUser.resource = resources;
        this.individualService.displayUser.next(displayUser);
        this.initializeResources('individual');
      });
  }
}
