import { Component } from '@angular/core';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent {
  selected: string = 'Basic';

  // onTabChange(inputEvent: any){
  //   console.log(inputEvent)
  // }
  changeTab(inputEvent: any) {
    console.log(inputEvent.target.innerText);
    this.selected = inputEvent.target.innerText
  }
}
