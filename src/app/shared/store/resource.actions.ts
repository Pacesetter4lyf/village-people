import { createAction, props } from '@ngrx/store';
import { Resource } from '../resource.model';

export const BEGIN_FETCH_IND_RESOURCE = '[Resource] Begin Fetch Ind Resource';
export const BEGIN_FETCH_LINEAGE_RESOURCE =
  '[Resource] Begin Fetch Lineage Resource';
export const BEGIN_CREATE_NEW_RESOURCE = '[Resource] Begin Create new Resource';
export const CREATE_NEW_RESOURCE_SUCCESS =
  '[Resource] Create new Resource success';
export const BEGIN_PATCH_RESOURCE = '[Resource] Begin Patch Resource';
export const PATCH_RESOURCE_SUCCESS = '[Resource] Patch Resource Success';
export const FETCH_IND_RESOURCE_SUCCESS =
  '[Resource] Fetch Ind Resource Success';
export const FETCH_LINEAGE_RESOURCE_SUCCESS =
  '[Resource] Fetch Lineage Resource Success';
export const SERVER_ERROR_OCCURED = '[Resource] Server Error Occured';
export const ERROR_GETTING_RESOURCE = '[Resource] Error Getting Resource';
export const FETCH_IND_RESOURCE_ERROR = '[Resource] Fetch Ind Resource ERROR';
export const CHANGE_ACTIVE_RESOURCE = '[Resource] Change Active Resource';
export const CHANGE_MEDIA_EDITABLE = '[Resource] Change Media Editable';
export const CLOSE_MODAL = '[Resource] Close Modal';
export const PREPARE_MODAL_EDIT = '[Resource] Prepare Modal Edit';
export const OPEN_MODAL_CREATE = '[Resource] Open Modal Create';

export const beginFetchIndResource = createAction(
  BEGIN_FETCH_IND_RESOURCE,
  props<{ id: string }>()
);
export const beginFetchLineageResource = createAction(
  BEGIN_FETCH_LINEAGE_RESOURCE,
  props<{ id: string }>()
);
export const beginCreateNewResource = createAction(
  BEGIN_CREATE_NEW_RESOURCE,
  props<{ resource: FormData }>()
);
export const createNewResourceSuccess = createAction(
  CREATE_NEW_RESOURCE_SUCCESS,
  props<{ resource: Resource }>()
);
export const beginPatchResource = createAction(
  BEGIN_PATCH_RESOURCE,
  props<{ resource: FormData, id: string }>()
);
export const patchResourceSuccess = createAction(
  PATCH_RESOURCE_SUCCESS,
  props<{ resource: Resource, id: string }>()
);
export const serverErrorOccured = createAction(
  SERVER_ERROR_OCCURED,
  props<{ error: string }>()
);
export const fetchIndResourceSuccess = createAction(
  FETCH_IND_RESOURCE_SUCCESS,
  props<{ resource: Resource[]; id: string }>()
);
export const fetchLineageResourceSuccess = createAction(
  FETCH_LINEAGE_RESOURCE_SUCCESS,
  props<{ resource: Resource[] }>()
);
export const fetchIndResourceError = createAction(
  FETCH_IND_RESOURCE_ERROR,
  props<{ resource: Resource[] }>()
);
export const changeActiveResource = createAction(
  CHANGE_ACTIVE_RESOURCE,
  props<{ resourceType:  "image" | "text" | "audio" | "video"  }>()
);
export const prepareModalEdit = createAction(
  PREPARE_MODAL_EDIT,
  props<{ id: string }>()
);
export const closeModal = createAction(CLOSE_MODAL);
export const openModalCreate = createAction(OPEN_MODAL_CREATE);
export const changeMediaEditable = createAction(
  CHANGE_MEDIA_EDITABLE,
  props<{ mediaEditable: boolean }>()
);

export const errorGettingResource = createAction(
  ERROR_GETTING_RESOURCE,
  props<{ error: string }>()
);
