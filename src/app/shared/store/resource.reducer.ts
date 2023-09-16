import { createReducer, on } from '@ngrx/store';
import { Resource } from '../resource.model';
import {
  beginCreateNewResource,
  beginFetchIndResource,
  beginFetchLineageResource,
  changeActiveResource,
  changeMediaEditable,
  closeModal,
  createNewResourceSuccess,
  fetchIndResourceError,
  fetchIndResourceSuccess,
  fetchLineageResourceSuccess,
  openModalCreate,
  patchResourceSuccess,
  prepareModalEdit,
} from './resource.actions';

export interface state {
  individualResource: Resource[];
  userId: string;
  lineageResource: Resource[];
  addMediaContentType: 'image' | 'text' | 'audio' | 'video';
  //   editedResourceId: string;
  isEditingId: string;
  isCreatingNew: boolean;
  mediaEditable: boolean;
  error: string;
  loading: boolean;
  showModal: boolean;
}

export const initialState: state = {
  individualResource: [],
  userId: null,
  lineageResource: null,
  addMediaContentType: null,
  //   editedResourceId: null,
  isEditingId: null,
  isCreatingNew: true,
  mediaEditable: false,
  error: null,
  loading: false,
  showModal: false,
};

export const resourceReducer = createReducer(
  initialState,
  on(beginFetchIndResource, (state, action) => {
    return { ...state, loading: true, isCreatingNew: true };
  }),
  on(fetchIndResourceSuccess, (state, action) => {
    return {
      ...state,
      individualResource: action.resource,
      loading: false,
      userId: action.id,
      isCreatingNew: true,
    };
  }),
  on(beginFetchLineageResource, (state, action) => {
    return { ...state, loading: true };
  }),
  on(fetchLineageResourceSuccess, (state, action) => {
    return {
      ...state,
      lineageResource: action.resource,
      loading: false,
    };
  }),
  on(changeActiveResource, (state, action) => {
    return {
      ...state,
      addMediaContentType: action.resourceType,
    };
  }),
  on(changeMediaEditable, (state, action) => {
    return {
      ...state,
      mediaEditable: action.mediaEditable,
    };
  }),
  on(beginCreateNewResource, (state, action) => {
    // sending to db
    return {
      ...state,
      loading: true,
    };
  }),
  on(openModalCreate, (state, action) => {
    return {
      ...state,
      isEditingId: null,
      isCreatingNew: true,
      showModal: true,
    };
  }),
  on(prepareModalEdit, (state, action) => {
    return {
      ...state,
      isEditingId: action.id,
      isCreatingNew: false,
      showModal: true,
    };
  }),

  on(closeModal, (state, action) => {
    // sending to db
    return {
      ...state,
      showModal: false,
    };
  }),
  on(createNewResourceSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      individualResource: [...state.individualResource, action.resource],
      lineageResource: state.lineageResource
        ? [...state.lineageResource, action.resource]
        : [action.resource],
      isCreatingNew: true,
    };
  }),
  on(patchResourceSuccess, (state, action) => {
    const resourceIndex = state.individualResource.findIndex(
      (resource) => resource._id === action.id
    );
    let individualResource = JSON.parse(
      JSON.stringify(state.individualResource)
    );
    individualResource[resourceIndex] = action.resource;
    return {
      ...state,
      individualResource,
    };
  }),
  on(fetchIndResourceError, (state, action) => {
    return { ...state, userId: null };
  })
);
