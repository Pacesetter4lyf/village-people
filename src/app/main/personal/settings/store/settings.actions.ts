import { createAction, props } from '@ngrx/store';
import { SettingsInterface } from './settings.reducer';

const BEGIN_GET_USER_FIELDS = '[settings] Begin Get User Fields';
const SUCCESS_GET_USER_FIELDS = '[settings] Success Get User Fields';

const GET_RESOURCE_FIELDS = '[settings] Get Resource Fields';
const SET_RESOURCE_FIELDS = '[settings] Set Resource Fields';

const BEGIN_PATCH_USER_FIELDS = '[settings] Begin Patch User Fields';
const SUCCESS_PATCH_USER_FIELDS = '[settings] Success Patch User Fields';

const BEGIN_PATCH_RESOURCE_FIELDS = '[settings] Begin Patch Resource Fields';
const SUCCESS_PATCH_RESOURCE_FIELDS =
  '[settings] Success Patch Resource Fields';

const ERROR_RESPONSE_FROM_SERVER = '[settings] Error Response From Server';

export const CHANGE_SELECTED_TAB = '[settings] Change Selected Tab';
export const CHANGE_SELECTED_MEDIA = '[settings] Change Selected Media';

export const beginGetUserFields = createAction(
  BEGIN_GET_USER_FIELDS,
  props<{ id: string }>()
);
export const successGetUserFields = createAction(
  SUCCESS_GET_USER_FIELDS,
  props<{ userFields: SettingsInterface[] }>()
);
export const beginPatchUserFields = createAction(
  BEGIN_PATCH_USER_FIELDS,
  props<{ id: string; name: string; visibility: string }>()
);
export const successPatchUserFields = createAction(
  SUCCESS_PATCH_USER_FIELDS,
  props<{ id: string; visibility: string; name: string }>()
);
export const beginPatchResourceFields = createAction(
  BEGIN_PATCH_RESOURCE_FIELDS,
  props<{ id: string; visibility: string }>()
);
export const successPatchResourceFields = createAction(
  SUCCESS_PATCH_RESOURCE_FIELDS,
  props<{ id: string; visibility: string }>()
);
export const getResourceFields = createAction(GET_RESOURCE_FIELDS);
export const setResourceFields = createAction(
  SET_RESOURCE_FIELDS,
  props<{ resourceFields: SettingsInterface[] }>()
);

export const errorResponseFromServer = createAction(
  ERROR_RESPONSE_FROM_SERVER,
  props<{ error: string }>()
);

export const changeSelectedTab = createAction(
  CHANGE_SELECTED_TAB,
  props<{ selected: string }>()
);
export const changeSelectedMedia = createAction(
  CHANGE_SELECTED_MEDIA,
  props<{ selectedMedia: string }>()
);
