import { createAction, props } from '@ngrx/store';
import { TreeModel } from '../tree.model';

export const FETCH_NODE_BEGIN = '[tree] fetch node begin';
export const FETCH_NODE_SUCCESS = '[tree] fetch node success';
export const DELETE_NODE_BEGIN = '[tree] delete node begin';
export const DELETE_NODE_SUCCESS = '[tree] delete node success';
export const FETCH_NODE_ERROR = '[tree] fetch node error';
export const SHOW_APPEND_MODAL = '[tree] show append modal';
export const CLOSE_APPEND_MODAL = '[tree] close append modal';

export const fetchNodeBegin = createAction(
  FETCH_NODE_BEGIN,
  props<{ id: string }>()
);

export const fetchNodeSuccess = createAction(
  FETCH_NODE_SUCCESS,
  props<{ node: TreeModel }>()
);

export const deleteNodeBegin = createAction(
  DELETE_NODE_BEGIN,
  props<{ id: string }>()
);
export const deleteNodeSuccess = createAction(DELETE_NODE_SUCCESS);

export const showAppendModal = createAction(SHOW_APPEND_MODAL);
export const closeAppendModal = createAction(CLOSE_APPEND_MODAL);
export const fetchNodeError = createAction(
  FETCH_NODE_ERROR,
  props<{ error: string }>()
);
