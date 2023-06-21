import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LineageService } from '../lineage.service';
import { TreeService } from '../tree/tree.service';

@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css'],
})
export class AppendComponent {
  @ViewChild('f') node: NgForm;
  @ViewChild('close') button: ElementRef;

  constructor(
    private lineageService: LineageService,
    private treeService: TreeService
  ) {}
  nodes = ['father', 'mother', 'husband', 'wife', 'sibling', 'child'];

  onAppend() {
    const appendAs = this.node.value.appendOptions;
    if (appendAs) {
      this.button.nativeElement.click();
      this.lineageService.appendNode(appendAs, this.treeService.tree._id);
      // this.lineageService.appendNode('daughter', this.treeService.tree._id);
    }
  }
}
