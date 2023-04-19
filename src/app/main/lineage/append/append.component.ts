import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LineageService } from '../lineage.service';

@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css'],
})
export class AppendComponent {
  @ViewChild('f') node: NgForm;
  @ViewChild('close') button: ElementRef;

  constructor(private router: Router, private lineageService: LineageService) {}
  nodes = [
    'father',
    'mother',
    'husband',
    'wife',
    'brother',
    'sister',
    'son',
    'daughter',
  ];

  onAppend() {
    if (this.node.value.appendOptions) {
      this.button.nativeElement.click();
      this.lineageService.appendNode();
    }
  }
}
