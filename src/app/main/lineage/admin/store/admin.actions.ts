import { createAction, createReducer, props } from '@ngrx/store';
import { codeRowInterface, personRowInterface } from '../admin.service';

export const FETCH_MEMBERS_BEGIN = '[admin] fetch memebers begin';
export const FETCH_MEMBERS_SUCCESS = '[admin] fetch memebers success';
export const SERVER_RETURNS_ERROR = '[admin] server returns error';
export const FETCH_CODE_BEGIN = '[admin] fetch code begin';
export const FETCH_CODE_SUCCESS = '[admin] fetch code success';
export const CHANGE_TAB = '[admin] change tab';
export const SELECT_TABLE_ROW = '[admin] select table row';
export const GENERATE_CODE_BEGIN = '[admin] generate code begin';
export const GENERATE_CODE_SUCCESS = '[admin] generate code success';
export const REVOKE_CODE_BEGIN = '[admin] revoke code begin';
export const REVOKE_CODE_SUCCESS = '[admin] revoke code success';
export const MERGE_NODE_BEGIN = '[admin] merge node begin';
export const MERGE_NODE_SUCCESS = '[admin] merge node success';
export const FIND_PEOPLE_BEGIN = '[admin] find person begin';
export const FIND_PEOPLE_SUCCESS = '[admin] find person success';
export const SEND_REQUEST_TO_EXTERNAL_BEGIN =
  '[admin] send request to external begin';
export const SEND_REQUEST_TO_EXTERNAL_SUCCESS =
  '[admin] send request to external success';
export const SEE_SOURCE_NODE_BEGIN = '[admin] see source node begin';
export const SEE_SOURCE_NODE_SUCCESS = '[admin] see source node success';
export const DECLINE_ENABLE_REQUEST_BEGIN =
  '[admin] decline enable request begin';
export const DECLINE_ENABLE_REQUEST_SUCCESS =
  '[admin] decline enable request succcess';
export const CHANGE_LINEAGE = '[admin] change lineage';
export const CHANGE_MEMBER_STATUS_BEGIN = '[admin] member status begin';
export const CHANGE_MEMBER_STATUS_SUCCESS = '[admin] member status success';

export const fetchMembersBegin = createAction(FETCH_MEMBERS_BEGIN);
export const fetchMembersSuccess = createAction(
  FETCH_MEMBERS_SUCCESS,
  props<{ members: personRowInterface[] }>()
);

export const fetchCodeBegin = createAction(FETCH_CODE_BEGIN);
export const fetchCodeSuccess = createAction(
  FETCH_CODE_SUCCESS,
  props<{ codes: codeRowInterface[] }>()
);

export const serverReturnsError = createAction(
  SERVER_RETURNS_ERROR,
  props<{ error: string }>()
);

export const selectTableRow = createAction(
  SELECT_TABLE_ROW,
  props<{ table: number | string; index: number }>()
);

export const generateCodeBegin = createAction(
  GENERATE_CODE_BEGIN,
  props<{
    id: string;
    joinType: string;
    appendMode: string;
    nodeTo?: string;
  }>()
);

export const generateCodeSuccess = createAction(
  GENERATE_CODE_SUCCESS,
  props<{ code: codeRowInterface }>()
);

export const revokeCodeBegin = createAction(
  REVOKE_CODE_BEGIN,
  props<{ id: string }>()
);

export const revokeCodeSuccess = createAction(
  REVOKE_CODE_SUCCESS,
  props<{ id: string }>()
);

export const changeTab = createAction(CHANGE_TAB, props<{ tab: string }>());

export const mergeNodeBegin = createAction(
  MERGE_NODE_BEGIN,
  props<{ id: string }>()
);
export const mergeNodeSuccess = createAction(
  MERGE_NODE_SUCCESS,
  props<{ id: string; newNode: personRowInterface }>()
);

export const findPeopleBegin = createAction(
  FIND_PEOPLE_BEGIN,
  props<{ text: string }>()
);
export const findPeopleSuccess = createAction(
  FIND_PEOPLE_SUCCESS,
  props<{ text: string; people: personRowInterface[] }>()
);

export const sendRequestToExternalBegin = createAction(
  SEND_REQUEST_TO_EXTERNAL_BEGIN,
  props<{ codeId: string; nodeFrom: string; nodeTo: string }>()
);

export const sendRequestToExternalSuccess = createAction(
  SEND_REQUEST_TO_EXTERNAL_SUCCESS,
  props<{
    codeId: string;
    nodeFrom: string;
    nodeTo: string;
    codes: codeRowInterface[];
  }>()
);

export const seeSourceNodeBegin = createAction(
  SEE_SOURCE_NODE_BEGIN,
  props<{ code: number }>()
);

export const seeSourceNodeSuccess = createAction(
  SEE_SOURCE_NODE_SUCCESS,
  props<{ codeRow: codeRowInterface }>()
);

export const updateRequestBegin = createAction(
  DECLINE_ENABLE_REQUEST_BEGIN,
  props<{ id: string; status: string }>()
);
export const updateRequestSuccess = createAction(
  DECLINE_ENABLE_REQUEST_SUCCESS,
  props<{ id: string; status: string; codeRow: codeRowInterface }>()
);

export const changeLineage = createAction(
  CHANGE_LINEAGE,
  props<{ lineage: 'all' | number }>()
);

export const changeMemberStatusBegin = createAction(
  CHANGE_MEMBER_STATUS_BEGIN,
  props<{ action: 'remove' | 'reinstate'; id: string; lineage: number }>()
);

export const changeMemberStatusSuccess = createAction(
  CHANGE_MEMBER_STATUS_SUCCESS,
  props<{
    action: 'remove' | 'reinstate' | 'archive' | 'nothing';
    id: string;
    lineage: number;
  }>()
);
