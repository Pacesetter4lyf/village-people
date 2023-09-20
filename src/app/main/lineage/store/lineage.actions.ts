import { createAction, props } from '@ngrx/store';
import { itemInterface } from './lineage.reducer';

const SEARCH_TEXT_BEGIN = '[link] begin search text';
const SEARCH_TEXT_SUCCESS = '[link] search text success';
const RESULT_IS_SELECTED = '[link] result is selected';
const GET_RELATIONSHIP_BEGIN = '[link] get relationship begin';
const GET_RELATIONSHIP_SUCCESS = '[link] get relationship successs';
const SERVER_RETURNS_ERROR = '[link] server returns error';
const LINK_UNLINK_BEGIN = '[link] link unlink begin';
const LINK_UNLINK_SUCCESS = '[link] link unlink success';
const DUMMY = '[link] dummy';

const SEARCH_MEMBER_BEGIN = '[search] search member begin';
const SEARCH_MEMBER_SUCCESS = '[search] search member success';
const SEARCH_RESULT_SELECTED = '[search] search member selected';
const CHANGE_SEARCH_INSIDE = '[search] change search inside';

export const searchTextBegin = createAction(
  SEARCH_TEXT_BEGIN,
  props<{ text: string; for: 'A' | 'B' }>()
);

export const searchTextSuccess = createAction(
  SEARCH_TEXT_SUCCESS,
  props<{ result: itemInterface[]; for: 'A' | 'B' }>()
);
export const resultIsSelected = createAction(
  RESULT_IS_SELECTED,
  props<{ item: itemInterface; for: 'A' | 'B' }>()
);
export const linkUnlinkBegin = createAction(
  LINK_UNLINK_BEGIN,
  props<{
    idA: string;
    idB: string;
    relationship: string;
    set: boolean;
    linkNode: boolean;
  }>()
);
export const linkUnlinkSuccess = createAction(
  LINK_UNLINK_SUCCESS,
  props<{ relationship: string }>()
);
export const getRelationshipBegin = createAction(
  GET_RELATIONSHIP_BEGIN,
  props<{ idA: string; idB: string }>()
);
export const getRelationshipSuccess = createAction(
  GET_RELATIONSHIP_SUCCESS,
  props<{ relationship: string }>()
);

export const serverReturnsError = createAction(
  SERVER_RETURNS_ERROR,
  props<{ error: string }>()
);
export const dummy = createAction(DUMMY);

export const searchMemberBegin = createAction(
  SEARCH_MEMBER_BEGIN,
  props<{ text: string, searchInside: boolean }>()
);
export const searchMemberSuccess = createAction(
  SEARCH_MEMBER_SUCCESS,
  props<{ members: itemInterface[] }>()
);

export const searchResultSelected = createAction(
  SEARCH_RESULT_SELECTED,
  props<{ index: number }>()
);

export const changeSearchInside = createAction(
  CHANGE_SEARCH_INSIDE,
  props<{ searchInside: boolean }>()
);

