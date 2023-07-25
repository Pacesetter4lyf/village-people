import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminService,
  codeRowInterface,
  personRowInterface,
} from './admin.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      lastName: [''],
      state: [''],
      village: [''],
    });
  }

  navItems: string[] = [
    'all members',
    'generate code',
    'generated codes',
    '-',
    'find people',
    'incoming requests',
    'request status', // cancelled and completed
    'sent requests',
    'apply code',
    'archived',
  ];
  itemSelected: string = this.navItems[0];

  controlledBy: string = 'me';
  joinType = 'replace';
  appendMode = 'none';

  membersList: personRowInterface[];
  codesList: codeRowInterface[];
  sentRequest: codeRowInterface[];
  incomingRequest: codeRowInterface[];
  generatedRequest: codeRowInterface[];
  requestStatusList: codeRowInterface[];
  foundPersonFromCode: codeRowInterface;
  allMembersSub: Subscription;
  allCodesSub: Subscription;

  // the people got by finding
  peopleFound: personRowInterface[];

  t2SelectedRow: number;
  t3SelectedRow: number;
  t4SelectedRow: number; // find people
  t5SelectedRow: number; // 2nd table in find people
  t6SelectedRow: number;
  tMembersApplyCode: number; // for the table to select the person to apply code on
  // the details for the form
  form: FormGroup;

  // for the navigation
  itemClicked(item: string) {
    this.itemSelected = item;
  }

  controlledByChanged() {
    console.log(this.controlledBy);
  }

  ngOnInit() {
    console.log('Hello here');
    //for instance where you add a member in individual and then move to the admin
    this.adminService.fetchMembersList();
    this.allMembersSub = this.adminService.getMembers().subscribe((members) => {
      this.membersList = members;
      console.log(this.membersList);
    });

    this.allCodesSub = this.adminService.getCodes().subscribe((codes) => {
      this.codesList = codes;

      this.sentRequest = this.codesList.filter((item) => {
        return item.nodeTo && item.generatedBy === this.adminService.getMyId();
      });
      this.incomingRequest = this.codesList.filter((item) => {
        return item.nodeTo && item.generatedBy !== this.adminService.getMyId();
      });
      //requestStatusList
      const membersListId = this.membersList.map((item) => item.id);
      this.generatedRequest = this.codesList.filter((item) => {
        return membersListId.includes(item.userData.id);
      });

      this.requestStatusList = this.codesList.filter((item) => {
        return item.status !== 'created';
      });
    });

    this.adminService.foundCode.subscribe((person) => {
      this.foundPersonFromCode = person;
    });

    // when find people is clicked, i want to subscribe to it
    this.adminService.findResult.subscribe((response) => {
      this.peopleFound = response;
    });
  }

  ngOnDestroy() {
    this.allMembersSub.unsubscribe();
    this.allCodesSub.unsubscribe();
  }

  viewNode(id: string, publicNode?: boolean) {
    this.adminService.viewNode(id, publicNode);
  }
  selectRow(table: number | string, i: number) {
    if (table === 2) {
      this.t2SelectedRow = i;
    }
    if (table === 4) {
      //for found people
      this.t4SelectedRow = i;
    }
    if (table === 5) {
      this.t5SelectedRow = i;
    }
    if (table === 6) {
      this.t6SelectedRow = i;
    }
    if (table === 'tMembersApplyCode') {
      this.tMembersApplyCode = i;
    }
    //tMembersApplyCode
  }

  generateCode(generateType: string) {
    if (generateType === 'generateOnly' && this.t2SelectedRow === undefined)
      return;
    this.adminService.generateCode(
      this.membersList[this.t2SelectedRow].id,
      this.joinType,
      this.appendMode
    );
  }

  revokeCode(id: string) {
    this.adminService.cancelCode(id);
  }

  beginMerge(id: string) {
    // this.navItems = [...this.navItems, 'merge']
    // this.itemClicked('merge');
    // to merge a node, the nodeTo will become the owner and user of the node
    // the userData is archived and instances of userDataId is
    // replaced with the incoming, i.e the nodeTo
    console.log(id);
    this.adminService.beginMerge(id);
  }

  findPeople() {
    const values = this.form.value;
    let { lastName } = values;
    console.log('form values', values);
    if (lastName) {
      this.adminService.findPeople(lastName);
    }
  }
  sendRequestToExternal() {
    //here send t4 and t5. i.e. send t5 details to t4 who is the guest
    // it also shows up in your list of sent requests
    console.log(
      'recipient ',
      this.peopleFound[this.t4SelectedRow],
      'nodeToBeMerged',
      this.codesList[this.t5SelectedRow]
    );
    this.adminService.sendRequestToExternal(
      this.codesList[this.t5SelectedRow],
      this.peopleFound[this.t4SelectedRow]
    );
  }
  generateCode2(formValues: any) {
    console.log('form values ', formValues);
    const { replace_append, append } = formValues;
    console.log(
      replace_append === 'append' && !append,
      this.t4SelectedRow === undefined,
      !replace_append
    );
    if (
      (replace_append === 'append' && !append) ||
      this.t4SelectedRow === undefined ||
      !replace_append
    )
      return;
    this.adminService.generateCode(
      this.peopleFound[this.t4SelectedRow].id,
      replace_append,
      append,
      this.adminService.getMyId()
    );
  }

  seeSourceNode(code: string) {
    console.log('code ', code);
    this.adminService.seeSourceNode(code);
  }

  declineEnableRequest(id: string, index: number) {
    const request = this.incomingRequest[index];
    const requestStatus = request.status;
    if (requestStatus === 'declined') {
      // enable the request. a patch with status set to created
      this.adminService.updateRequest(request.id, 'created');
    } else {
      // decline the request. a patch with status set to declined
      this.adminService.updateRequest(request.id, 'declined');
    }
  }
}
