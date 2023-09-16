import { createReducer, on } from '@ngrx/store';
import { Individual } from '../individual.model';
import {
  actualUserFetchSuccess,
  beginAppendMember,
  createAppendSuccess,
  displayUserFetchSuccess,
  errorGettingUser,
  patchOthersSuccess,
  patchSelfSuccess,
} from './individual.actions';
import { DisplayModeType } from '../individual.service';

export interface state {
  mode:
    | 'registering'
    | 'self'
    | 'user-creating'
    | 'admin-viewing'
    | 'user-viewing'
    | 'user-created-not-owned'
    | 'lineage-viewing'
    | 'guest';
  actualUser: Individual;
  displayUser: Individual;
  editable: Individual;
  isEditingBasic: boolean;
  isEditingEducation: boolean;
  isEditingBiography: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string;
  appendAsWhat: string;
  appendTo: string;
}

const initialState: state = {
  mode: 'self',
  actualUser: null,
  displayUser: null,
  editable: new Individual(),
  isEditingBasic: false,
  isEditingEducation: false,
  isEditingBiography: false,
  isLoading: true,
  isInitialized: false,
  error: '',
  appendAsWhat: null,
  appendTo: null,
};

const getMode = (
  actualUser: Individual,
  displayUser: Individual
): DisplayModeType => {
  if (displayUser.createdBy === actualUser._id && !displayUser.userId) {
    return 'user-viewing';
  } else if (displayUser._id === actualUser._id) {
    return 'self';
  } else {
    // check whether it is lineage viewing
    const intersect = displayUser.lineage.filter((item) =>
      actualUser.lineage.includes(item)
    );
    if (intersect.length) return 'lineage-viewing';
    else return 'guest';
  }
};
export const individualReducer = createReducer(
  initialState,
  on(actualUserFetchSuccess, (state, action) => {
    return {
      ...state,
      actualUser: action.individual,
      displayUser: action.individual,
      mode: 'self' as DisplayModeType,
    };
  }),
  on(displayUserFetchSuccess, (state, action) => {
    const mode = getMode(state.actualUser, action.individual);
    return { ...state, displayUser: action.individual, mode };
  }),
  on(patchSelfSuccess, (state, action) => {
    return { ...state, actualUser: action.individual };
  }),
  on(patchOthersSuccess, (state, action) => {
    return { ...state, displayUser: action.individual };
  }),
  on(createAppendSuccess, (state, action) => {
    return {
      ...state,
      displayUser: action.individual,
      mode: 'user-viewing' as DisplayModeType,
    };
  }),
  on(errorGettingUser, (state, action) => {
    return { ...state, error: action.error };
  }),
  on(beginAppendMember, (state, action) => {
    return {
      ...state,
      displayUser: new Individual(),
      appendAsWhat: action.appendAsWhat,
      appendTo: action.appendTo,
      mode: 'user-creating' as DisplayModeType,
    };
  })
);
