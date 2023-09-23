import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, Subscription, map, take } from 'rxjs';
import { itemInterface } from '../lineage.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as lineageActions from '../store/lineage.actions';
import * as treeActions from '../tree/store/tree.actions';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
})
export class LinkComponent {
  values = ['father', 'mother', 'husband', 'wife', 'sibling', 'child'];
  A: itemInterface[];
  B: itemInterface[];
  @ViewChild('textA') textA: ElementRef;
  @ViewChild('textB') textB: ElementRef;
  selectedA: itemInterface;
  selectedB: itemInterface;
  relationship: string;
  storeSub: Subscription;
  storeSub2: Subscription;
  linkNode = false;

  constructor(private router: Router, private store: Store<frmApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('lineage').subscribe((data) => {
      this.A = data.A || [];
      this.B = data.B || [];
      this.selectedA = data.selectedA;
      this.selectedB = data.selectedB;
      this.relationship = data.relationship;
    });
  }

  setUnset(value: string) {
    if (this.linkNode) {
      let answer = confirm('Are you sure you want to build linkages of B?');
      if (!answer) return;
    }
    if (this.selectedA && this.selectedB) {
      this.store.dispatch(
        lineageActions.linkUnlinkBegin({
          idA: this.selectedA.id,
          idB: this.selectedB.id,
          relationship: value,
          set: this.relationship === 'none',
          linkNode: this.linkNode,
        })
      );
    }
  }

  search(text: 'A' | 'B') {
    let toSearch: string;
    if (text === 'A') {
      toSearch = this.textA.nativeElement.value;
    } else {
      toSearch = this.textB.nativeElement.value;
    }
    if (!toSearch.trim()) return;
    this.store.dispatch(
      lineageActions.searchTextBegin({ text: toSearch, for: text })
    );
  }

  onSelect(letter: string, id: string) {
    let selectedA: itemInterface;
    let selectedB: itemInterface;
    let changed = false;
    if (letter === 'A') {
      selectedA = this.A.find((item) => item.id === id);
      if (this.selectedA?.id !== selectedA.id) changed = true;
      this.store.dispatch(
        lineageActions.resultIsSelected({ item: selectedA, for: 'A' })
      );
    } else {
      selectedB = this.B.find((item) => item.id === id);
      if (this.selectedB?.id !== selectedB.id) changed = true;
      this.store.dispatch(
        lineageActions.resultIsSelected({ item: selectedB, for: 'B' })
      );
    }
    this.storeSub2 = this.store.select('lineage').subscribe((lineage) => {
      if (changed && lineage.selectedA?.id && lineage.selectedB?.id) {
        this.store.dispatch(
          lineageActions.getRelationshipBegin({
            idA: lineage.selectedA?.id,
            idB: lineage.selectedB?.id,
          })
        );
        this.storeSub2.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    this.storeSub2 && this.storeSub2.unsubscribe();
  }

  viewNode(side: string) {
      if (side === 'A' && this.selectedA) {
        this.store.dispatch(treeActions.fetchNodeBegin({id: this.selectedA.id}))
      } else if (this.selectedB) {
        this.store.dispatch(treeActions.fetchNodeBegin({id: this.selectedB.id}))
      }
      if (this.selectedA || this.selectedB) {
        this.router.navigate(['lineage', 'tree']);
      }
  }
}
