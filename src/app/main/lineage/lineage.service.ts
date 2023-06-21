import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { respType } from 'src/app/shared/types/response.type';
import { IndividualService } from '../personal/individual.service';

export interface itemInterface {
  firstName: string;
  lastName: string;
  id: string;
  father?: {
    firstName: string;
  };
  mother?: {
    firstName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class LineageService {
  constructor(
    private router: Router,
    private individualService: IndividualService,
    private http: HttpClient
  ) {}
  appendNode(asWhat: string, appendTo: string) {
    this.individualService.addIndividual('user-creating', asWhat, appendTo);
    this.router.navigate(['individual']);
  }

  getSearch(text: string) {
    // get the user by id
    //
    return this.http.get<respType<itemInterface[]>>(
      `http://localhost:3001/api/v1/userdata/search/${text}`
    );
  }

  getRelationship(A: string, B: string) {
    return this.http.get<respType<string>>(
      `http://localhost:3001/api/v1/userdata/relationship/${A}/${B}`
    );
  }

  setUnset(a: string, b: string, relationship: string, set: boolean) {
    return this.http.patch<respType<string>>(
      `http://localhost:3001/api/v1/userdata/relationship/${a}/${b}`,
      {
        relationship: relationship,
        set: set,
      }
    );
  }
}
