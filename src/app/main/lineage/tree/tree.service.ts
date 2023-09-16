import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { respType } from 'src/app/shared/types/response.type';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { TreeInterface, TreeModel } from './tree.model';
import { environment } from 'src/environments/environment';
import { Individual } from '../../personal/individual.model';
import { Store } from '@ngrx/store';
import * as frmApp from 'src/app/store/app.reducer';
import * as IndividualActions from '../../personal/store/individual.actions';
const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class TreeService {
  tree: TreeModel;
  treeChanged = new Subject<TreeModel>();
  nodeId: string;
  individual: Individual;
  storeSub: Subscription;

  constructor(
    private router: Router,
    private individualService: IndividualService,
    private http: HttpClient,
    private store: Store<frmApp.AppState>
  ) {
    this.storeSub = this.store.select('individual').subscribe((individual) => {
      this.nodeId = individual.actualUser._id;
      this.individual = individual.actualUser;
    });
  }

  changeNode(nodeId?: string) {
    this.nodeId = nodeId;
  }
  resetNode() {
    this.nodeId = this.individualService.actualUser.value?._id;
  }

  fetchTreeNode(nodeId?: string) {
    if (!nodeId) {
      nodeId = this.nodeId;
    }

    this.http
      .get<respType<TreeInterface>>(`${apiUrl}/userdata/tree/${nodeId}`)
      .subscribe((value) => {
        // console.log('patch', value);
        if (value.status === 'success') {
          this.tree = value.data.data;
          this.treeChanged.next(this.tree);
        }
      });
    // console.log('nodeId ', nodeId);
  }

  showDetails() {
    // this.individualService.showDetails(this.tree._id);
  

    this.store.dispatch(
      IndividualActions.beginDataFetch({
        id: this.tree._id,
        isSelf: this.nodeId === this.tree._id,
      })
    );

    this.router.navigate(['individual']);
  }

  deleteNode(id: string) {
    this.http.delete<respType<string>>(`${apiUrl}/userdata/${id}`).subscribe();
    this.resetNode();
    this.fetchTreeNode();
  }
}
