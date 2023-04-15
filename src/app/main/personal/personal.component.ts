import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceService } from 'src/app/shared/modal/resource.service';
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

  constructor(
    private individualService: IndividualService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.clickSub = this.individualService.tabClickEvent.subscribe(
      (inputEvent) => {
        this.selected = (<HTMLElement>inputEvent.target).innerText;
      }
    );

    this.individualService.displayMode.subscribe(
      (mode) => (this.displayMode = mode)
    );
    this.resourceService.viewingIndividual.next(true);
    this.resourceService.initializeResources('individual');
  }

  ngOnDestroy() {
    this.clickSub.unsubscribe();
  }
}
