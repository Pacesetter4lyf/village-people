import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-personal-header',
  templateUrl: './personal-header.component.html',
  styleUrls: ['./personal-header.component.css'],
})
export class PersonalHeaderComponent {
  @Output() tabClickEvent = new EventEmitter<PointerEvent>();
  selected = 'Basic';

  onTabChange(something: PointerEvent) {
    this.tabClickEvent.emit(something);
    this.selected = (<HTMLElement>something.target).innerText
  }
}
