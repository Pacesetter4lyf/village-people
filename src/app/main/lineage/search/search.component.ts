import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { respType } from 'src/app/shared/types/response.type';
import { itemInterface } from '../lineage.service';
import { Router } from '@angular/router';
import { TreeService } from '../tree/tree.service';
import { IndividualService } from '../../personal/individual.service';

import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as treeActions from '../tree/store/tree.actions';
import * as lineageActions from '../store/lineage.actions';
import * as individualActions from '../../personal/store/individual.actions';
const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchText = '';
  foundEntries: itemInterface[];
  selectedEntry: itemInterface;
  searchInside: boolean = true;

  constructor(private router: Router, private store: Store<frmApp.AppState>) {}

  ngOnInit() {
    this.store.select('lineage').subscribe((lineage) => {
      this.foundEntries = lineage.foundEntries;
      this.selectedEntry =
        lineage.selectedIndex >= 0
          ? { ...this.foundEntries[lineage.selectedIndex] }
          : null;
    });
  }

  onSubmit() {
    if (!this.searchText) return;
    this.store.dispatch(
      lineageActions.searchMemberBegin({
        text: this.searchText,
        searchInside: this.searchInside,
      })
    );
  }

  selectResult(i: number) {
    this.store.dispatch(lineageActions.searchResultSelected({ index: i }));
  }

  toggleLineageSelector() {
    this.onSubmit();
  }

  showTree(id: string) {
    this.store.dispatch(treeActions.fetchNodeBegin({ id }));
    this.router.navigate(['lineage', 'tree']);
  }

  showDetails(id: string) {
    this.store.dispatch(
      individualActions.beginDataFetch({ id, isSelf: false })
    );
    this.router.navigate(['individual']);
  }
}
