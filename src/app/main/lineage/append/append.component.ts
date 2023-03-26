import { Component } from '@angular/core';

@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css'],
})
export class AppendComponent {
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
}
