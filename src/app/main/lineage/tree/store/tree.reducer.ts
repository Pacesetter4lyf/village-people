import { createReducer, on } from '@ngrx/store';
import { TreeModel } from '../tree.model';
import * as TreeActions from './tree.actions';

export interface state {
  node: TreeModel;
  isDeleteable: boolean;
  showModal: boolean;
  isFetching: boolean;
  error: string;
}

export const initialState: state = {
  node: null,
  isDeleteable: false,
  showModal: false,
  isFetching: false,
  error: null,
};

export const treeReducer = createReducer(
  initialState,
  on(TreeActions.fetchNodeBegin, (state, action) => {
    return { ...state, isFetching: true };
  }),
  on(TreeActions.fetchNodeSuccess, (state, action) => {
    return { ...state, node: action.node, isFetching: false };
  }),
  on(TreeActions.showAppendModal, (state, action) => {
    return { ...state, showModal: true };
  }),
  on(TreeActions.closeAppendModal, (state, action) => {
    return { ...state, showModal: false };
  })
);


