import { Component } from '@angular/core';

@Component({
  selector: 'app-lineage-header',
  templateUrl: './lineage-header.component.html',
  styleUrls: ['./lineage-header.component.css'],
})
export class LineageHeaderComponent {
  selected = 2;
  tabs = ["Tree", 'Discussions', 'Birthdays', 'Funds', 'Media', "Search"];

  tabClick(tab: string){
    console.log(tab)
  }
}
