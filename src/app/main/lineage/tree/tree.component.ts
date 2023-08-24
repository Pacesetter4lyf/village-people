import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeModel } from './tree.model';
import { TreeService } from './tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit, OnDestroy {
  constructor(private treeService: TreeService) {}
  treeSub: Subscription;
  tree: TreeModel;
  ngOnInit() {
    //subscribe to changes in the clicked node
    this.treeService.fetchTreeNode();
    this.treeSub = this.treeService.treeChanged.subscribe((tree) => {
      this.tree = tree;
    });
    console.log('tree ', this.tree);
  }
  ngOnDestroy() {
    this.treeSub.unsubscribe();
    this.treeService.resetNode();
  }
  
  deleteNode() {
    if (this.tree._id) {
      this.treeService.deleteNode(this.tree._id);
      
    }
  }
  nodeSelected(nodeId: string) {
    this.treeService.fetchTreeNode(nodeId);
  }

  seeDetails() {
    this.treeService.showDetails();
  }
}
