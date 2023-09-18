import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LineageService } from '../lineage.service';
import { TreeService } from '../tree/tree.service';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import { Subscription, map, take } from 'rxjs';
import * as IndividualActions from '../../personal/store/individual.actions';

@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css'],
})
export class AppendComponent {
  @ViewChild('f') node: NgForm;
  @ViewChild('close') button: ElementRef;
  storeSub: Subscription;

  constructor(
    private lineageService: LineageService,
    private treeService: TreeService,
    private store: Store<frmApp.AppState>
  ) {}
  nodes = ['father', 'mother', 'husband', 'wife', 'sibling', 'child'];

  onAppend() {
    const appendAs = this.node.value.appendOptions;
    if (appendAs) {
      this.button.nativeElement.click();
      this.store
        .select('tree')
        .pipe(take(1))
        .subscribe((tree) => {
          this.store.dispatch(
            IndividualActions.beginAppendMember({
              appendAsWhat: appendAs,
              appendTo: tree.node._id,
            })
          );
        });
    }
  }
}
