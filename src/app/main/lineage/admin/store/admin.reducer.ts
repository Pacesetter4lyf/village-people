import { createReducer, on } from '@ngrx/store';
import { codeRowInterface, personRowInterface } from '../admin.service';
import * as adminActions from './admin.actions';
export interface state {
  members: personRowInterface[];
  codesList: codeRowInterface[];
  peopleFound: personRowInterface[];
  userLineage: string[];
  selectedLineage: string | number | 'all';
  tabSelected: string;
  controlledBy: string;
  joinType: 'replace' | 'append';
  appendMode: 'none';
  foundPersonFromCode: codeRowInterface;
  t2SelectedRow: number;
  t3SelectedRow: number;
  t4SelectedRow: number; // find people
  t5SelectedRow: number; // 2nd table in find people
  t6SelectedRow: number;
  tMembersApplyCode: number;
  dataLoaded: boolean;
  error: string;
  currentLineage: 'all' | number;
}

export const initialState: state = {
  members: null,
  userLineage: null,
  codesList: null,
  peopleFound: [],
  selectedLineage: null,
  tabSelected: 'all members',
  controlledBy: 'me',
  joinType: 'replace',
  appendMode: 'none',
  foundPersonFromCode: undefined,
  t2SelectedRow: 0,
  t3SelectedRow: 0,
  t4SelectedRow: 0,
  t5SelectedRow: 0,
  t6SelectedRow: 0,
  tMembersApplyCode: 0,
  dataLoaded: false,
  error: '',
  currentLineage: 'all',
};

export const adminReducer = createReducer(
  initialState,
  on(adminActions.fetchCodeSuccess, (state, action) => {
    return { ...state, codesList: action.codes };
  }),
  on(adminActions.fetchMembersSuccess, (state, action) => {
    return { ...state, members: action.members };
  }),
  on(adminActions.selectTableRow, (state, action) => {
    let table: string;
    switch (action.table) {
      case 2:
        table = 't2SelectedRow';
        break;
      case 4:
        table = 't4SelectedRow';
        break;
      case 5:
        table = 't5SelectedRow';
        break;
      case 6:
        table = 't6SelectedRow';
        break;
      case 'tMembersApplyCode':
        table = 'tMembersApplyCode';
        break;
    }
    return { ...state, [table]: action.index };
  }),
  on(adminActions.generateCodeSuccess, (state, action) => {
    return { ...state, codesList: [...state.codesList, action.code] };
  }),
  on(adminActions.serverReturnsError, (state, action) => {
    return { ...state, error: action.error };
  }),
  on(adminActions.revokeCodeSuccess, (state, action) => {
    const codeList = [...state.codesList];
    const newCodeList = codeList.filter((c) => c.id !== action.id);
    return { ...state, codesList: newCodeList };
  }),
  on(adminActions.changeTab, (state, action) => {
    return { ...state, tabSelected: action.tab };
  }),
  on(adminActions.mergeNodeSuccess, (state, action) => {
    const codeList = [...state.codesList];
    const newCodeList = codeList.filter((c) => c.id !== action.id);
    return {
      ...state,
      codesList: newCodeList,
    };
  }),
  on(adminActions.findPeopleSuccess, (state, action) => {
    return { ...state, peopleFound: action.people };
  }),
  on(adminActions.seeSourceNodeSuccess, (state, action) => {
    return { ...state, foundPersonFromCode: action.codeRow };
  }),
  on(adminActions.updateRequestSuccess, (state, action) => {
    let codeList = [...state.codesList];
    let index = codeList.findIndex((c) => c.id === action.id);
    let codeRow = { ...codeList[index] };
    codeRow.status = action.codeRow.status;
    codeList[index] = codeRow;
    return { ...state, codesList: codeList };
  }),
  on(adminActions.changeLineage, (state, action) => {
    return { ...state, currentLineage: action.lineage };
  }),
  // on(adminActions.sendRequestToExternalSuccess, (state, action) => {
  //   let codes = state.codesList;
  //   const index = codes.findIndex((c) => c.id === action.codeId);
  //   // codes[index] = action.code;
  //   return { ...state, codesList: action.codes };
  // }),

  // the below works fine
  // on(adminActions.changeMemberStatusSuccess, (state, action) => {
  //   const index = state.members.findIndex((member) => member.id === action.id);
  //   let members = [...state.members];
  //   let member = { ...members.find((member) => member.id === action.id) };
  //   if (action.action === 'archive') {
  //     member.status = 'archived';
  //     members[index] = member;
  //   } else if (action.action === 'remove') {
  //     members.splice(index, 1);
  //   } else if (action.action === 'reinstate') {
  //     member.status = 'active';
  //     members[index] = member;
  //   }
  //   return { ...state, members: members };
  // })
);
