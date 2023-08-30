import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { respType } from 'src/app/shared/types/response.type';
import { itemInterface } from '../lineage.service';
import { Router } from '@angular/router';
import { TreeService } from '../tree/tree.service';
import { IndividualService } from '../../personal/individual.service';

import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchText = '';
  important = ['firstname', 'lastname', 'father', 'mother'];
  foundEntries: itemInterface[];
  selectedIndex: number;
  selectedEntry: itemInterface;
  searchInside = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private treeService: TreeService,
    private individualService: IndividualService
  ) {}

  onSubmit() {
    if (!this.searchText) return;
    const params = new HttpParams().set(
      'searchOutside',
      (!this.searchInside).toString()
    );
    this.http
      .get<respType<itemInterface[]>>(
        `${apiUrl}/userdata/search/${this.searchText}`,
        { params }
      )
      .subscribe((resp) => {
        this.selectedEntry = null;
        this.selectedIndex = null;
        this.foundEntries = resp.data.data;
      });
  }

  selectResult(i: number) {
    this.selectedIndex = i;
    this.selectedEntry = this.foundEntries[i];
  }

  toggleLineageSelector() {
    this.onSubmit();
  }

  showTree(id: string) {
    this.treeService.changeNode(id);
    this.router.navigate(['lineage', 'tree']);
  }
  
  showDetails(id: string) {
    this.individualService.showDetails(id);
    this.router.navigate(['individual']);
  }
}
