import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { itemInterface, LineageService } from '../lineage.service';
import { TreeService } from '../tree/tree.service';
import { Router } from '@angular/router';

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
  selectSubscribe: Subscription;
  searchSubscribtion: Subscription;

  constructor(
    private lineageService: LineageService,
    private treeService: TreeService,
    private router: Router
  ) {}

  ngOnInit() {}

  setUnset(value: string) {
    console.log(value);
    if (this.selectedA && this.selectedB) {
      this.lineageService
        .setUnset(
          this.selectedA?.id,
          this.selectedB?.id,
          value,
          this.relationship === 'none'
        )
        .subscribe((resp) => {
          if (resp.status == 'success') {
            this.relationship = resp.data.data;
          }
        });
    }
  }

  search(text: string) {
    let toSearch: string;
    if (text === 'A') {
      toSearch = this.textA.nativeElement.value;
    } else {
      toSearch = this.textB.nativeElement.value;
    }
    if (!toSearch.trim()) return;
    console.log('hello', toSearch);
    this.searchSubscribtion = this.lineageService
      .getSearch(toSearch)
      .subscribe((data) => {
        text === 'A' ? (this.A = data.data.data) : (this.B = data.data.data);
        console.log(data);
      });
  }

  onSelect(letter: string, id: string) {
    const currentA = this.selectedA;
    const currentB = this.selectedB;
    let changed = false;
    if (letter === 'A') {
      this.selectedA = this.A.find((item) => item.id === id);
      if (currentA?.id !== this.selectedA?.id) changed = true;
    } else {
      this.selectedB = this.B.find((item) => item.id === id);
      if (currentB?.id !== this.selectedB?.id) changed = true;
    }

    if (changed && this.selectedA?.id && this.selectedB?.id) {
      this.selectSubscribe = this.lineageService
        .getRelationship(this.selectedA.id, this.selectedB.id)
        .subscribe((resp) => {
          this.relationship = resp.data.data;
          console.log(this.relationship);
        });
    }
  }

  ngOnDestroy() {
    this.selectSubscribe && this.selectSubscribe.unsubscribe();
    this.searchSubscribtion && this.searchSubscribtion.unsubscribe();
  }

  viewNode(side: string) {
    if (side === 'A' && this.selectedA) {
      this.treeService.changeNode(this.selectedA.id);
    } else if (this.selectedB) {
      this.treeService.changeNode(this.selectedB.id);
    }
    if (this.selectedA || this.selectedB) {
      this.router.navigate(['lineage', 'tree']);
    }
  }
}
