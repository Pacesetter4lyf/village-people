import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { HttpClient } from '@angular/common/http';
import { respType } from 'src/app/shared/types/response.type';
import { Observable, map, of, tap } from 'rxjs';
import { TreeService } from '../tree/tree.service';

export interface personRowInterface {
  id: string;
  firstName: string;
  lastName: string;
  mother: string;
  father: string;
  wife: string;
  husband: string;
}
export interface codeRowInterface {
  id: string;
  mode: string;
  code: string;
  userData: {
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
  ) {}

  private personList: personRowInterface[] | null = null;
  private codeList: codeRowInterface[] | null = null;

  getMembers(): Observable<personRowInterface[]> {
    if (this.personList) {
      return of(this.personList);
    } else {
      return this.http
        .get<respType<personRowInterface[]>>(
          'http://localhost:3001/api/v1/userdata/members/members'
        )
        .pipe(
          map((response) => response.data.data),
          tap((data) => {
            this.personList = data;
          })
        );
    }
  }

  viewNode(id: string) {
    this.treeService.changeNode(id);
    this.router.navigate(['lineage', 'tree']);
  }

  generateCode(id: string, joinType: string, appendMode: string) {
    if (joinType === 'append' && appendMode === 'none') return;
    return this.http
      .post<respType<personRowInterface[]>>(
        'http://localhost:3001/api/v1/joincode',
        {
          userData: id,
          mode: joinType === 'replace' ? 'replace' : appendMode,
        }
      )
      .subscribe((response) => {
        console.log(response.data.data);
        this.getCodes(true)
      });
    //emit event that makes the get code run anew
  }

  getCodes(refresh?: true): Observable<codeRowInterface[]> {
    if (this.codeList && !refresh) {
      return of(this.codeList);
    } else {
      return this.http
        .get<respType<codeRowInterface[]>>(
          'http://localhost:3001/api/v1/joincode'
        )
        .pipe(
          map((response) => response.data.data),
          tap((data) => {
            this.codeList = data;
            console.log(data);
          })
        );
    }
  }
}
