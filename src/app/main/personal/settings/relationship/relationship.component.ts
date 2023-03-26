import { Component } from '@angular/core';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.css'],
})
export class RelationshipComponent {
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
