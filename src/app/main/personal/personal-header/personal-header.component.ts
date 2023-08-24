import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IndividualService } from '../individual.service';

@Component({
  selector: 'app-personal-header',
  templateUrl: './personal-header.component.html',
  styleUrls: ['./personal-header.component.css'],
})
export class PersonalHeaderComponent implements OnInit {
  selected = 'Basic';

  constructor(private individualService: IndividualService) {}
  tabs = [];
  allTabs: string[] = [
    'Basic',
    'Education',
    'Bibliography',
    'Media',
    'Settings',
    // 'Chats',
  ];
  mode: string;
  isRegistered: boolean;

  onTabChange(something: PointerEvent) {
    this.individualService.tabClickEvent.emit(something);
    this.selected = (<HTMLElement>something.target).innerText;
  }
  ngOnInit() {
    this.individualService.displayMode.subscribe((mode) => {
      this.mode = mode;
      // console.log(mode);
      if (mode === 'self') {
        this.tabs = [...this.allTabs];
      } else if (mode === 'user-creating' || mode === 'registering') {
        this.tabs = [this.allTabs[0]];
      } else if (mode === 'user-viewing') {
        const newTabs = [...this.allTabs];
        newTabs.splice(7, 1);
        this.tabs = newTabs;
      } else {
        this.tabs = this.allTabs.slice(0, 7);
      }
    });
  }
}
