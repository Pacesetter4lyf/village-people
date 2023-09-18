import { createReducer, on } from '@ngrx/store';
import * as lineageActions from './lineage.actions';

export interface itemInterface {
  firstName: string;
  lastName: string;
  id: string;
  father?: {
    firstName: string;
  };
  mother?: {
    firstName: string;
  };
}

export interface state {
  values: ['father', 'mother', 'husband', 'wife', 'sibling', 'child'];
  A: itemInterface[];
  B: itemInterface[];
  textA: string;
  textB: string;
  selectedA: itemInterface;
  selectedB: itemInterface;
  relationship: string;
  linkNode: boolean;
  error: string;
}

const initialState: state = {
  values: ['father', 'mother', 'husband', 'wife', 'sibling', 'child'],
  A: null,
  B: null,
  textA: '',
  textB: '',
  selectedA: null,
  selectedB: null,
  relationship: null,
  linkNode: false,
  error: '',
};

export const lineageReducer = createReducer(
  initialState,
  on(lineageActions.searchTextSuccess, (state, action) => {
    let side: 'A' | 'B';
    let selectedSide: 'selectedA' | 'selectedB';
    if (action.for === 'A') {
      side = 'A';
      selectedSide = 'selectedA';
    } else {
      side = 'B';
      selectedSide = 'selectedB';
    }
    return { ...state, [side]: action.result, [selectedSide]: null };
  }),
  on(lineageActions.searchTextBegin, (state, action) => {
    let textSide: 'textA' | 'textB';
    if (action.for === 'A') {
      textSide = 'textA';
    } else {
      textSide = 'textB';
    }
    return { ...state, [textSide]: action.text };
  }),
  on(lineageActions.resultIsSelected, (state, action) => {
    let selectedSide: 'selectedA' | 'selectedB';
    if (action.for === 'A') {
      selectedSide = 'selectedA';
    } else {
      selectedSide = 'selectedB';
    }
    return { ...state, [selectedSide]: action.item };
  }),
  on(lineageActions.linkUnlinkSuccess, (state, action) => {
    return { ...state, relationship: action.relationship };
  }),
  on(lineageActions.getRelationshipSuccess, (state, action) => {
    return { ...state, relationship: action.relationship };
  })
);
