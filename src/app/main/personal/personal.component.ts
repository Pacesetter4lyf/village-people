import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IndividualService } from './individual.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit, OnDestroy {
  selected: string = 'Basic';
  dataLoaded = true;
  clickSub: Subscription;
  displayUserSub: Subscription;
  displayMode: string;

  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    this.clickSub = this.individualService.tabClickEvent.subscribe(
      (inputEvent) => {
        this.selected = (<HTMLElement>inputEvent.target).innerText;
      }
    );
    this.displayMode = this.individualService.displayMode;
  }

  ngOnDestroy() {
    this.clickSub.unsubscribe();
  }
}
