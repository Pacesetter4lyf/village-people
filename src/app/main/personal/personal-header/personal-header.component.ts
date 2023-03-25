import { Component, EventEmitter, Output } from '@angular/core';
import { IndividualService } from '../individual.service';

@Component({
  selector: 'app-personal-header',
  templateUrl: './personal-header.component.html',
  styleUrls: ['./personal-header.component.css'],
})
export class PersonalHeaderComponent {
  // @Output() tabClickEvent = new EventEmitter<PointerEvent>();
  selected = 'Basic';

  constructor(private individualService: IndividualService) {}
  tabs: string[] = [
    'Basic',
    'Education',
    'Bibliography',
    'Recordings',
    'Pictures',
    'Videos',
    'Posts',
    'Chats',
    'Settings',
  ];

  onTabChange(something: PointerEvent) {
    this.individualService.tabClickEvent.emit(something);
    this.selected = (<HTMLElement>something.target).innerText;
  }

}
