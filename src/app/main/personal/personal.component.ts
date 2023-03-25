import { Component, OnInit } from '@angular/core';
import { IndividualService } from './individual.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  selected: string = 'Basic';
  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    this.individualService.tabClickEvent.subscribe((inputEvent) => {
      this.selected = (<HTMLElement>inputEvent.target).innerText;
    });
  }
}
