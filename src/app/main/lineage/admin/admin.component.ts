import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminService,
  codeRowInterface,
  personRowInterface,
} from './admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor(private adminService: AdminService) {}

  navItems: string[] = [
    'all members',
    'generate code',
    'generated codes',
    'incoming requests',
    'find people',
    'sent requests',
    'apply code',
  ];
  itemSelected: string = this.navItems[0];

  controlledBy: string = 'me';
  joinType = 'replace';
  appendMode = 'none';

  membersList: personRowInterface[];
  codesList: codeRowInterface[];
  allMembersSub: Subscription;
  allCodesSub: Subscription;

  t2SelectedRow: number;
  t3SelectedRow: number;

  // for the navigation
  itemClicked(item: string) {
    this.itemSelected = item;
  }

  controlledByChanged() {
    console.log(this.controlledBy);
  }

  ngOnInit() {
    this.allMembersSub = this.adminService
      .getMembers()
      .subscribe((members) => (this.membersList = members));

    this.allCodesSub = this.adminService
      .getCodes()
      .subscribe((codes) => (this.codesList = codes));
  }

  ngOnDestroy() {
    this.allMembersSub.unsubscribe();
    this.allCodesSub.unsubscribe();
  }

  viewNode(id: string) {
    this.adminService.viewNode(id);
  }
  selectRow(table: number, i: number) {
    if (table === 2) {
      this.t2SelectedRow = i;
    }
  }

  generateCode() {
    if (!this.t2SelectedRow) return;
    this.adminService.generateCode(
      this.membersList[this.t2SelectedRow].id,
      this.joinType,
      this.appendMode
    );
  }
}
