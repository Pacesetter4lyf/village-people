import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { respType } from 'src/app/shared/types/response.type';
import { IndividualService } from '../../personal/individual.service';
import { LineageService } from '../lineage.service';
import { TreeInterface, TreeModel } from './tree.model';
import { environment } from 'src/environments/environment';
import { Individual } from '../../personal/individual.model';
const apiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class TreeService {
  tree: TreeModel;
  treeChanged = new Subject<TreeModel>();
  nodeId: string;
  individual: Individual;
  constructor(
    private router: Router,
    private individualService: IndividualService,
    private lineageService: LineageService,
    private http: HttpClient
  ) {
    this.nodeId = this.individualService.actualUser.value?._id;

    this.individual = this.individualService.actualUser.value;
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
    this.individualService.showDetails(this.tree._id);
    this.router.navigate(['individual']);
  }

  deleteNode(id: string) {
    this.http.delete<respType<string>>(`${apiUrl}/userdata/${id}`).subscribe();
    this.resetNode();
    this.fetchTreeNode();
  }
}
