import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminService,
  codeRowInterface,
  personRowInterface,
} from './admin.service';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as ChatActions from '../../chat/store/chat.actions';
import { Store } from '@ngrx/store';
import * as appState from 'src/app/store/app.reducer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<appState.AppState>
  ) {
    this.form = this.formBuilder.group({
      lastName: [''],
      state: [''],
      village: [''],
    });
    this.currentLineage = 'all';
  }

  navItems: string[] = [
    'all members',
    'generate code',
    'generated codes',
    'find people',
    'apply code',
    'incoming requests',
    'sent requests',
    'archived',
  ];
  itemSelected: string = this.navItems[0];

  controlledBy: string = 'me';
  joinType = 'replace';
  appendMode = 'none';

  membersList: personRowInterface[];
  archivedList: personRowInterface[];
  filteredMembersList: personRowInterface[];
  codesList: codeRowInterface[];
  sentRequest: codeRowInterface[];
  incomingRequest: codeRowInterface[];
  generatedRequest: codeRowInterface[];
  requestStatusList: codeRowInterface[];
  foundPersonFromCode: codeRowInterface;
  allMembersSub: Subscription;
  allCodesSub: Subscription;

  // the lineage
  currentLineage: 'all' | number;
  userLineage: string[];

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

  // controlledByChanged() {
  //   console.log(this.controlledBy);
  // }

  ngOnInit() {
    this.adminService.fetchMembersList();
    this.allMembersSub = this.adminService.personListObservable
      .pipe(
        switchMap((members) => {
          this.membersList = [...members];
          this.filteredMembersList = members.filter(
            (member) => member.status !== 'archived'
          );

          this.archivedList = members.filter(
            (member) => member.status === 'archived'
          );

          return this.adminService.getCodes(); // Return the second observable
        })
      )
      .subscribe((codes) => {
        this.codesList = codes;

        this.sentRequest = this.codesList.filter((item) => {
          return (
            item.nodeTo &&
            (item.sentBy === this.adminService.getMyId() )
          );
        });
        this.incomingRequest = this.codesList.filter((item) => {
          return (
            item.nodeTo && item.sentBy !== this.adminService.getMyId()
          );
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

    this.userLineage = ['all', ...this.adminService.getMe().lineage];
  }

  ngOnDestroy() {
    this.allMembersSub.unsubscribe();
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
    this.adminService.beginMerge(id);
  }

  findPeople() {
    const values = this.form.value;
    let { lastName } = values;
    if (lastName) {
      this.adminService.findPeople(lastName);
    }
  }
  sendRequestToExternal(codeSearched?: string) {
    //here send t4 and t5. i.e. send t5 details to t4 who is the guest
    // it also shows up in your list of sent requests

    if (codeSearched) {
      this.adminService.sendRequestToExternal(
        this.foundPersonFromCode.id,
        this.foundPersonFromCode.userData.id,
        this.membersList[this.tMembersApplyCode].id
      );
      return;
    }
    console.log(
      'recipient ',
      this.peopleFound[this.t4SelectedRow],
      'nodeToBeMerged',
      this.codesList[this.t5SelectedRow]
    );
    this.adminService.sendRequestToExternal(
      this.codesList[this.t5SelectedRow].id,
      this.codesList[this.t5SelectedRow].userData.id,
      this.peopleFound[this.t4SelectedRow].id
    );
  }
  generateCode2(formValues: any) {
    // console.log('form values ', formValues);
    const { replace_append, append } = formValues;
    // console.log(
    //   replace_append === 'append' && !append,
    //   this.t4SelectedRow === undefined,
    //   !replace_append
    // );
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
    // console.log('code ', code);
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
  lineageChanged() {
    // console.log('lineage has changed');
    if (this.currentLineage === 'all')
      this.filteredMembersList = [...this.membersList];
    else {
      this.filteredMembersList = this.membersList.filter((member) => {
        return member.lineage.includes(+this.currentLineage);
      });
    }
  }

  changeMemberStatus(id: string, action: string) {
    // if you are the admin of the node
    //    if it was created by you  and has no other lineage then delete it
    //    if it wasnt created by you then remove it

    if (this.currentLineage === 'all' && action === 'remove') {
      alert('select an actual lineage');
      return;
    }
    //lineage we adminster
    const adminOf = this.adminService.getMe().adminOf;
    // the node we want to remove
    const target = this.membersList.filter((members) => members.id === id)[0]; // sould e find
    // find the node, and then if we admin the node
    // console.log(target);
    if (target && target.lineage.filter((item) => adminOf.includes(item))) {
      if (action === 'remove') {
        this.adminService.changeMemberStatus(
          'remove',
          id,
          +this.currentLineage
        );
      } else {
        this.adminService.changeMemberStatus('reinstate', id);
      }
    } else {
      alert('you are not an admin');
    }
  }

  chatMember(id: string) {
    // this.adminService.switchToSelf()
    const firstName = this.membersList.find((m) => m.id === id);
    this.router.navigate(['./individual', 'chats', id], {
      queryParams: firstName,
    });
  }

  openChat(id: string, name: string) {
    // this.adminService.openChat(id, name)

    this.store.dispatch(
      new ChatActions.ConversationOpenInitiated({ id, name })
    );
  }
}
