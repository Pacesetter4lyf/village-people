import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { HttpClient } from '@angular/common/http';
import { respType } from 'src/app/shared/types/response.type';
import { TreeService } from '../tree/tree.service';

import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';

const apiUrl = environment.apiUrl;

export interface personRowInterface {
  id: string;
  firstName: string;
  lastName: string;
  mother: string;
  father: string;
  wife: string;
  husband: string;
  lineage: number[];
  status: string;
  // user: boolean | string;
}
export interface codeRowInterface {
  id: string;
  nodeTo: {
    id: string;
    firstName: string;
    lastName: string;
    mother?: {
      firstname: string;
      lastName: string;
    };
    father?: {
      firstname: string;
      lastName: string;
    };
  };
  generatedBy: string;
  sentBy: string;
  mode: string;
  code: string;
  status: string;
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    mother?: {
      firstname: string;
      lastName: string;
    };
    father?: {
      firstname: string;
      lastName: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private router: Router,
    private individualService: IndividualService,
    private lineageService: LineageService,
    private http: HttpClient,
    private treeService: TreeService
  ) {
    this.fetchMembersList();
    this.fetchCodes();
    this.currentLineage = this.individualService.actualUser.value.lineage[0];
  }

  // trying out the different method
  private isDataLoaded: boolean = false;

  private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public personListObservable = new BehaviorSubject<personRowInterface[]>([]);
  private codeListObservable = new BehaviorSubject<codeRowInterface[]>([]);
  private cachedPersonList: personRowInterface[];
  private cachedCodeList: codeRowInterface[];
  public foundCode = new Subject<codeRowInterface>();

  public findResult = new Subject<personRowInterface[]>(); //also find people

  public currentLineage: string;

  fetchMembersList() {
    // if (this.isDataLoaded && this.cachedPersonList.length > 0) {
    //   // If data is already loaded and not empty, return the cached data
    //   return of(this.cachedPersonList);
    // }

    this.http
      .get<respType<personRowInterface[]>>(`${apiUrl}/userdata/members`)
      .pipe(
        catchError((error) => {
          this.errorSubject.next('Error fetching data from the server.');
          return throwError(() => new Error(error));
        }),
        map((response) => response.data.data),
        tap((data) => {
          this.cachedPersonList = data;
          this.personListObservable.next(this.cachedPersonList);
          this.isDataLoaded = true;
        })
      )
      .subscribe();
  }

  fetchCodes() {
    this.http
      .get<respType<codeRowInterface[]>>(`${apiUrl}/joincode`)
      .pipe(
        catchError((error) => {
          this.errorSubject.next('Error fetching data from the server.');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (value: respType<codeRowInterface[]>) => {
          this.cachedCodeList = value.data.data;
          this.codeListObservable.next(this.cachedCodeList);
          // console.log(this.cachedCodeList);
        },
        error: (error: any) => {
          this.errorSubject.next(
            'An error occurred while processing the data.'
          );
          console.error('Error fetching data:', error);
        },
        complete: () => {
          // Handle completion
        },
      });
  }

  getMembers(): Observable<personRowInterface[]> {
    // console.log('in the get members method');
    return this.personListObservable;
  }

  getCodes(): Observable<codeRowInterface[]> {
    return this.codeListObservable;
  }

  triggerDataChanged(): void {
    this.fetchMembersList();
  }

  viewNode(id: string, publicNode?: boolean) {
    if (publicNode) this.lineageService.changeViewMode(publicNode);
    this.treeService.changeNode(id);
    this.router.navigate(['lineage', 'tree']);
  }

  generateCode(
    id: string,
    joinType: string,
    appendMode: string,
    nodeTo?: string
  ) {
    if (joinType === 'append' && appendMode === 'none') return;
    this.http
      .post<respType<personRowInterface[]>>(`${apiUrl}/joincode`, {
        userData: id,
        mode: joinType === 'replace' ? 'replace' : appendMode,
        nodeTo: nodeTo,
      })
      .subscribe((response) => {
        // console.log(response.data.data);
        this.fetchCodes();
      });
    //emit event that makes the get code run anew
  }
  cancelCode(id: string) {
    this.http.delete(`${apiUrl}/joincode/${id}`).subscribe((response) => {
      // console.log('response is ', response);
      this.fetchCodes();
    });
  }

  findPeople(lastName: string) {
    this.http
      .get<respType<personRowInterface[]>>(
        `${apiUrl}/userdata/findpeople?lastName=${lastName}`
      )
      .subscribe((response) => {
        console.log(response.data.data);
        this.findResult.next(response.data.data);
      });
  }

  sendRequestToExternal(
    codeId: string,
    nodeFrom: string, //codeRowInterface,
    nodeTo: string //personRowInterface
  ) {
    this.http
      .patch<respType<codeRowInterface[]>>(`${apiUrl}/joincode/${codeId}`, {
        fromId: nodeFrom,
        nodeTo: nodeTo,
        newRequest: true,
        // fromId: nodeFrom.userData.id,
        // nodeTo: nodeTo.id,
      })
      .subscribe((response) => {
        // console.log(response.data.data);
        // this.fetchCodes();
      });
    this.fetchCodes();
  }

  getMyId() {
    return this.individualService.actualUser.value._id;
  }
  getMe() {
    return this.individualService.actualUser.value;
  }

  // when you put in a code and wants to find the person to which you will be attaching
  seeSourceNode(code: string) {
    this.http
      .get<respType<codeRowInterface>>(`${apiUrl}/joincode/code/${code}`)
      .subscribe((response) => {
        // console.log(response.data.data);
        this.foundCode.next(response.data.data);
      });
  }
  updateRequest(id: string, status: string) {
    // to cancel the request you send out. ideally, the generated by should be you
    // or you are the admin of the generatedBy
    let payload = {
      status: status,
    };
    this.http
      .patch(`${apiUrl}/joincode/${id}`, payload)
      .subscribe((response) => {
        this.fetchCodes();
      });
  }

  beginMerge(id: string) {
    this.http
      .get<respType<string>>(`${apiUrl}/joincode/merge/${id}`)
      .subscribe((response) => {
        // console.log(response.data.data);
        this.fetchMembersList();
        this.fetchCodes();
      });
  }

  changeMemberStatus(action: string, id: string, lineage?: number) {
    this.http
      .get(`${apiUrl}/userdata/member/${id}/${lineage}/${action}`)
      .subscribe((response) => {
        this.fetchCodes();
        this.fetchMembersList();
      });
  }
  switchToSelf() {
    this.individualService.switchToSelf();
  }
}
