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
import { Individual } from '.././main/personal/individual.model';

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
    private router: Router
  ) {
    this.resources = new BehaviorSubject<Resource[]>([this.emptyData]);

    // this.individualService.displayUser.subscribe(
    //   (user) => (this.displayUserId = user._id)
    // );

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        // React to route changes, perform necessary actions based on the route
        this.handleRouteChange();
      });

    this.individualService.displayMode.subscribe((mode) => {
      if (
        mode === 'self' ||
        mode === 'user-viewing' ||
        mode === 'user-created-not-owned'
      ) {
        this.mediaEditable = true;
      }else{
        this.mediaEditable = false;
      }
      console.log('mode changed ', mode);
    });
  }

  getMediaEditable() {
    return this.mediaEditable;
  }

  handleRouteChange() {
    // Your logic to handle route changes here...
    const nav = this.currentRoute.split('/').slice(1);
    const first = nav.at(0);
    const last = nav.at(-1);
    console.log('Current route:', first, last);
    // Perform actions specific to the route or fetch data based on the route, etc.
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
      if (!this.authService.user.value.isRegistered) {
        this.resources.next([this.emptyData]);
      } else if (this.lineageResources)
        this.resources.next(this.lineageResources);
      else {
        this.fetchAllResources().subscribe((response) => {
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
        this.resources.next(resp);
      })
    );
  }
  // to fetch the display user resource
  fetchUserResources() {
    // const displayUserId = this.individualService.getDisplayUser()._id;
    const userId = this.individualService.getDisplayUser()._id;
    this.displayUserId = userId;
    return this.http
      .get<any>(`http://localhost:3001/api/v1/resource/user/${userId}`)
      .pipe(
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
          this.userResources.push(response.data.data);
          if (this.lineageResources)
            this.lineageResources.push(response.data.data);
          this.resources.next(this.userResources);
          console.log(response);
        });
    } else {
      return this.http
        .patch<any>(
          `http://localhost:3001/api/v1/resource/${fileDetails.resourceId}`,

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
        const resources = this.lineageResources.filter(
          (resource) => resource._id !== resourceId
        );
        this.lineageResources = resources;
        this.initializeResources('individual');
      });
  }

  // getMyResources(): Observable<Resource[]> {
  //   if (this.userResources) return of(this.userResources);
  //   return this.fetchUserResources();
  // }
  getDUResources(): Observable<Resource[]> {
    return this.fetchUserResources();
  }
}
