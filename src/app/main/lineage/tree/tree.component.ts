import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map, switchMap, tap } from 'rxjs';
import { TreeModel } from './tree.model';
import * as frmApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as TreeActions from './store/tree.actions';
import * as IndividualActions from '../../personal/store/individual.actions';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit, OnDestroy {
  constructor(private store: Store<frmApp.AppState>) {}
  tree: TreeModel;
  isDeleteable: boolean;
  storeSub: Subscription;
  userId: string;
  ngOnInit() {
    //subscribe to changes in the clicked node
    this.storeSub = this.store
      .select('individual')
      .pipe(
        switchMap((individual) => {
          const id = individual.actualUser._id;
          this.userId = id;
          return this.store.select('tree').pipe(
            tap((tree) => {
              this.tree = tree.node;
              if (id === this.tree.createdBy && !this.tree.userId) {
                this.isDeleteable = true;
              } else {
                this.isDeleteable = false;
              }
            })
          );
        })
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

  deleteNode() {
    if (this.tree._id) {
      this.store.dispatch(TreeActions.deleteNodeBegin({ id: this.tree._id }));
    }
  }

  nodeSelected(nodeId: string) {
    this.store.dispatch(TreeActions.fetchNodeBegin({ id: nodeId }));
  }

  seeDetails() {
    this.store.dispatch(
      IndividualActions.beginDataFetch({
        id: this.tree._id,
        isSelf: this.userId === this.tree._id,
      })
    );
  }
}
