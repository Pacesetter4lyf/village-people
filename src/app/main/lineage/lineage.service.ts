import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IndividualService } from '../personal/individual.service';
@Injectable({ providedIn: 'root' })
export class LineageService {
  constructor(
    private router: Router,
    private individualService: IndividualService
  ) {}
  appendNode() {
    this.individualService.setDisplayMode('user-creating');
    this.router.navigate(['individual']);
  }
}
