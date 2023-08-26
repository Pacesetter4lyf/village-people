import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { respType } from 'src/app/shared/types/response.type';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { TreeInterface, TreeModel } from './tree.model';

@Injectable({ providedIn: 'root' })
export class TreeService {
  tree: TreeModel;
  treeChanged = new Subject<TreeModel>();
  nodeId: string;
  constructor(
    private router: Router,
    private individualService: IndividualService,
    private lineageService: LineageService,
    private http: HttpClient
  ) {
    this.nodeId = this.individualService.actualUser.value?._id;
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
      .get<respType<TreeInterface>>(
        `http://localhost:3001/api/v1/userdata/tree/${nodeId}`
      )
      .subscribe((value) => {
        console.log('patch', value);
        if (value.status === 'success') {
          this.tree = value.data.data;
          this.treeChanged.next(this.tree);
        }
      });
    console.log('nodeId ', nodeId);
  }

  showDetails() {
    this.individualService.showDetails(this.tree._id);
    this.router.navigate(['individual']);
  }

  deleteNode(id: string) {
    this.http
      .delete<respType<string>>(`http://localhost:3001/api/v1/userdata/${id}`)
      .subscribe();
    this.resetNode();
    this.fetchTreeNode();
  }
}
