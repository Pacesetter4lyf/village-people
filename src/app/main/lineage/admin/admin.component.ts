import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminService,
  codeRowInterface,
  personRowInterface,
} from './admin.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ChatActions from '../../chat/store/chat.actions';
import { Store } from '@ngrx/store';
import * as appState from 'src/app/store/app.reducer';
import * as treeActions from '../tree/store/tree.actions';
import * as adminActions from './store/admin.actions';
import { Individual } from '../../personal/individual.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor(
    // private adminService: AdminService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<appState.AppState>
  ) {
    this.form = this.formBuilder.group({
      lastName: [''],
      state: [''],
      village: [''],
    });
    // this.currentLineage = 'all';
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
  itemSelected: string;

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
  peopleFound: personRowInterface[];
  foundPersonFromCode: codeRowInterface;
  allMembersSub: Subscription;
  allCodesSub: Subscription;
  storeSub: Subscription;
  // the lineage
  currentLineage: 'all' | number;
  userLineage: string[];
  // the people got by finding

  t2SelectedRow: number;
  t3SelectedRow: number;
  t4SelectedRow: number; // find people
  t5SelectedRow: number; // 2nd table in find people
  t6SelectedRow: number;
  tMembersApplyCode: number; // for the table to select the person to apply code on
  // the details for the form
  form: FormGroup;
  userId: string;
  actualUser: Individual;

  // controlledByChanged() {
  //   console.log(this.controlledBy);
  // }

  ngOnInit() {
    this.storeSub = this.store
      .select('individual')
      .pipe(
        switchMap((person) => {
          const id = person.actualUser._id;
          const lineage = person.actualUser.lineage;
          this.actualUser = person.actualUser;
          this.userId = id;
          return this.store.select('admin').pipe(
            tap((admin) => {
              this.currentLineage = admin.currentLineage;
              this.membersList = [...admin.members];

              this.filteredMembersList = admin.members.filter(
                (member) =>
                  member.status !== 'archived' &&
                  (this.currentLineage === 'all' ||
                    member.lineage.includes(+this.currentLineage))
              );

              this.archivedList = admin.members.filter(
                (member) => member.status === 'archived'
              );
              this.codesList = admin.codesList;
              this.sentRequest = this.codesList.filter((item) => {
                return item.nodeTo && item.sentBy === id;
              });
              this.incomingRequest = this.codesList.filter((item) => {
                return item.nodeTo && item.sentBy !== id;
              });

              const membersListId = this.membersList.map((item) => item.id);
              this.generatedRequest = this.codesList.filter((item) => {
                return membersListId.includes(item.userData.id);
              });
              this.requestStatusList = this.codesList.filter((item) => {
                return item.status !== 'created';
              });
              this.foundPersonFromCode = admin.foundPersonFromCode;
              this.peopleFound = admin.peopleFound;
              this.userLineage = ['all', ...lineage];
              this.t2SelectedRow = admin.t2SelectedRow;
              this.t3SelectedRow = admin.t3SelectedRow;
              this.t4SelectedRow = admin.t4SelectedRow; // find people
              this.t5SelectedRow = admin.t5SelectedRow; // 2nd table in find people
              this.t6SelectedRow = admin.t6SelectedRow;
              this.tMembersApplyCode = admin.tMembersApplyCode;
              this.itemSelected = admin.tabSelected;
            })
          );
        })
      )
      .subscribe();
  }

  itemClicked(item: string) {
    this.store.dispatch(adminActions.changeTab({ tab: item }));
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

  viewNode(id: string, publicNode?: boolean) {
    // to view the node in the tree
    this.store.dispatch(treeActions.fetchNodeBegin({ id }));
    this.router.navigate(['..', 'tree'], { relativeTo: this.route });
  }

  selectRow(table: number | string, i: number) {
    //tMembersApplyCode
    this.store.dispatch(adminActions.selectTableRow({ table, index: i }));
  }

  generateCode(generateType: string) {
    if (this.joinType === 'append' && this.appendMode === 'none') return;
    if (generateType === 'generateOnly' && this.t2SelectedRow === undefined)
      return;
    this.store.dispatch(
      adminActions.generateCodeBegin({
        id: this.membersList[this.t2SelectedRow].id,
        joinType: this.joinType,
        appendMode: this.appendMode,
      })
    );
  }

  revokeCode(id: string) {
    this.store.dispatch(adminActions.revokeCodeBegin({ id }));
  }

  beginMerge(id: string) {
    this.store.dispatch(adminActions.mergeNodeBegin({ id }));
  }

  findPeople() {
    const values = this.form.value;
    let { lastName } = values;
    if (lastName) {
      this.store.dispatch(adminActions.findPeopleBegin({ text: lastName }));
    }
  }
  sendRequestToExternal(codeSearched?: string) {
    if (codeSearched) {
      this.store.dispatch(
        adminActions.sendRequestToExternalBegin({
          codeId: this.foundPersonFromCode.id,
          nodeFrom: this.foundPersonFromCode.userData.id, //codeRowInterface,
          nodeTo: this.membersList[this.tMembersApplyCode].id, //personRowInterface
        })
      );
      return;
    }
    console.log(
      "codeId:", this.codesList[this.t5SelectedRow].id,
      "nodeFrom:", this.codesList[this.t5SelectedRow].userData.id, //codeRowInterface,
      "nodeTo:", this.peopleFound[this.t4SelectedRow].id, //personRowInterface
    )
    this.store.dispatch(
      adminActions.sendRequestToExternalBegin({
        codeId: this.codesList[this.t5SelectedRow].id,
        nodeFrom: this.codesList[this.t5SelectedRow].userData.id, //codeRowInterface,
        nodeTo: this.peopleFound[this.t4SelectedRow].id, //personRowInterface
      })
    );
  }
  generateCode2(formValues: any) {
    const { replace_append, append } = formValues;
    if (
      (replace_append === 'append' && !append) ||
      this.t4SelectedRow === undefined ||
      !replace_append
    )
      return;
    this.store.dispatch(
      adminActions.generateCodeBegin({
        id: this.peopleFound[this.t4SelectedRow].id,
        joinType: replace_append,
        appendMode: append,
        nodeTo: this.userId,
      })
    );
  }

  seeSourceNode(code: number) {
    this.store.dispatch(adminActions.seeSourceNodeBegin({ code }));
  }

  declineEnableRequest(id: string, index: number, status: string) {
    console.log('status ', status);
    if (status === 'declined') {
      this.store.dispatch(
        adminActions.updateRequestBegin({ id, status: 'created' })
      );
    } else {
      this.store.dispatch(
        adminActions.updateRequestBegin({ id, status: 'declined' })
      );
    }
  }
  lineageChanged() {
    this.store.dispatch(
      adminActions.changeLineage({ lineage: this.currentLineage })
    );
  }

  changeMemberStatus(id: string, action: 'reinstate' | 'remove') {
    // if you are the admin of the node
    //    if it was created by you  and has no other lineage then delete it
    //    if it wasnt created by you then remove it
    if (this.currentLineage === 'all' && action === 'remove') {
      alert('select an actual lineage');
      return;
    }
    //lineage we adminster
    const adminOf = this.actualUser.adminOf;
    // the node we want to remove
    const target = this.membersList.find((members) => members.id === id); // sould e find
    // find the node, and then if we admin the node
    // console.log(target);
    if (target && target.lineage.filter((item) => adminOf.includes(item))) {
      this.store.dispatch(
        adminActions.changeMemberStatusBegin({
          action,
          id,
          lineage: +this.currentLineage,
        })
      );
    } else {
      alert('you are not an admin');
    }
  }

  openChat(id: string, name: string) {
    this.store.dispatch(
      new ChatActions.ConversationOpenInitiated({ id, name })
    );
  }
}
