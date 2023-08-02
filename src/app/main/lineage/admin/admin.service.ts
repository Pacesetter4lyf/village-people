import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { HttpClient } from '@angular/common/http';
import { respType } from 'src/app/shared/types/response.type';
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
import { TreeService } from '../tree/tree.service';

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
  private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private personListObservable = new BehaviorSubject<personRowInterface[]>([]);
  private codeListObservable = new BehaviorSubject<codeRowInterface[]>([]);
  private cachedPersonList: personRowInterface[];
  private cachedCodeList: codeRowInterface[];
  public foundCode = new Subject<codeRowInterface>();

  public findResult = new Subject<personRowInterface[]>(); //also find people

  public currentLineage: string;

  fetchMembersList() {
    this.http
      .get<respType<personRowInterface[]>>(
        'http://localhost:3001/api/v1/userdata/members'
      )
      .pipe(
        catchError((error) => {
          this.errorSubject.next('Error fetching data from the server.');
          return throwError(() => new Error(error));
        }),
        map((response) => response.data.data),
        tap((data) => {
          this.cachedPersonList = data;
          this.personListObservable.next(this.cachedPersonList);
        })
      )
      .subscribe({
        // next: (value: personRowInterface[]) => {
        //   this.personListObservable.next(value);
        // },
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
  fetchCodes() {
    this.http
      .get<respType<codeRowInterface[]>>(
        'http://localhost:3001/api/v1/joincode'
      )
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
          console.log(this.cachedCodeList);
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
    console.log('in the get members method');
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
    // let payload = {
    //   userData: id,
    //   mode: joinType === 'replace' ? 'replace' : appendMode,
    // };
    // if (nodeTo) payload = {...payload, [nodeTo]: nodeTo}

    this.http
      .post<respType<personRowInterface[]>>(
        'http://localhost:3001/api/v1/joincode',
        {
          userData: id,
          mode: joinType === 'replace' ? 'replace' : appendMode,
          nodeTo: nodeTo,
        }
      )
      .subscribe((response) => {
        console.log(response.data.data);
        this.fetchCodes();
      });
    //emit event that makes the get code run anew
  }
  cancelCode(id: string) {
    this.http
      .delete(`http://localhost:3001/api/v1/joincode/${id}`)
      .subscribe((response) => {
        console.log('response is ', response);
        this.fetchCodes();
      });
  }

  findPeople(lastName: string) {
    this.http
      .get<respType<personRowInterface[]>>(
        `http://localhost:3001/api/v1/userdata/findpeople?lastName=${lastName}`
      )
      .subscribe((response) => {
        console.log(response.data.data);
        this.findResult.next(response.data.data);
      });
  }

  sendRequestToExternal(
    nodeFrom: codeRowInterface,
    nodeTo: personRowInterface
  ) {
    this.http
      .patch<respType<codeRowInterface[]>>(
        `http://localhost:3001/api/v1/joincode/${nodeFrom.id}`,
        {
          fromId: nodeFrom.userData.id,
          nodeTo: nodeTo.id,
        }
      )
      .subscribe((response) => {
        console.log(response.data.data);
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
      .get<respType<codeRowInterface>>(
        `http://localhost:3001/api/v1/joincode/code/${code}`
      )
      .subscribe((response) => {
        console.log(response.data.data);
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
      .patch(`http://localhost:3001/api/v1/joincode/${id}`, payload)
      .subscribe((response) => {
        this.fetchCodes();
      });
  }

  beginMerge(id: string) {
    this.http
      .get<respType<string>>(
        `http://localhost:3001/api/v1/joincode/merge/${id}`
      )
      .subscribe((response) => {
        console.log(response.data.data);
        this.fetchCodes();
      });
  }

  changeMemberStatus(action: string, id: string, lineage?: number) {
    this.http
      .get(`http://localhost:3001/api/v1/userdata/member/${id}/${lineage}/${action}`)
      .subscribe((response) => {
        this.fetchCodes();
        this.fetchMembersList();
      });
  }
}
