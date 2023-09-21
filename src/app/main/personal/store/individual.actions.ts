import { createAction, props } from '@ngrx/store';
import { BasicDetailsInterface, Individual } from '../individual.model';

export const BEGIN_DATA_FETCH = '[individual] begin data fetch';
export const ACTUAL_USER_FETCH_SUCCESS =
  '[individual] Actual User Fetch Success';
export const DISPLAY_USER_FETCH_SUCCESS =
  '[individual] Display User Fetch Success';
export const OTHER_FETCH_SUCCESS = '[individual] Other Fetch Success';
export const BEGIN_CREATE_USER = '[individual] Begin Create User';
export const CREATE_SELF_SUCCESS = '[individual] Create Self Success';
export const CREATE_APPEND_SUCCESS = '[individual] Create Append Success';

export const BEGIN_PATCH_USER = '[individual] Begin Patch User';
export const PATCH_SELF_SUCCESS = '[individual] Patch Self Success';
export const PATCH_OTHERS_SUCCESS = '[individual] Patch Others Success';
export const BEGIN_APPEND_MEMBER = '[individual] Begin Append Member';

export const SET_ERROR_MESSAGE = '[individual] Set Individual Message';
export const ERROR_GETTING_USER = '[individual] Error Getting User';
export const CHANGE_MODE = '[individual] Change Mode';
export const WOULD_REGISTER = '[individual] Would Register';
export const REMOVE_USER = '[individual] Remove User';

export const beginDataFetch = createAction(
  BEGIN_DATA_FETCH,
  props<{ id: string; isSelf: boolean }>()
);

export const actualUserFetchSuccess = createAction(
  ACTUAL_USER_FETCH_SUCCESS,
  props<{ individual: Individual }>()
);
export const displayUserFetchSuccess = createAction(
  DISPLAY_USER_FETCH_SUCCESS,
  props<{ individual: Individual }>()
);
export const errorGettingUser = createAction(
  ERROR_GETTING_USER,
  props<{ error: string }>()
);

export const beginCreateUser = createAction(
  BEGIN_CREATE_USER,
  props<{ individual: FormData; isSelf: boolean }>()
);
export const beginPatchUser = createAction(
  BEGIN_PATCH_USER,
  props<{ individual: FormData; isSelf: boolean; id: string }>()
);
export const createSelfSuccess = createAction(
  CREATE_SELF_SUCCESS,
  props<{ individual: Individual }>()
);

export const patchSelfSuccess = createAction(
  PATCH_SELF_SUCCESS,
  props<{ individual: Individual }>()
);
export const patchOthersSuccess = createAction(
  PATCH_OTHERS_SUCCESS,
  props<{ individual: Individual }>()
);
export const createAppendSuccess = createAction(
  CREATE_APPEND_SUCCESS,
  props<{ individual: Individual }>()
);
export const beginAppendMember = createAction(
  BEGIN_APPEND_MEMBER,
  props<{ appendAsWhat: string; appendTo: string }>()
);
export const setErrorMessage = createAction(
  SET_ERROR_MESSAGE,
  props<{ error: string }>()
);

export const changeMode = createAction(
  CHANGE_MODE,
  props<{
    mode:
      | 'registering'
      | 'self'
      | 'user-creating'
      | 'admin-viewing'
      | 'user-viewing'
      | 'user-created-not-owned'
      | 'lineage-viewing'
      | 'guest';
  }>()
);

export const wouldRegister = createAction(WOULD_REGISTER);
export const removeUser = createAction(REMOVE_USER);
