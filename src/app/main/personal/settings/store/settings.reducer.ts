import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';

export interface SettingsInterface {
  name: string;
  value: string;
  id: string;
  type?: string;
}

export interface state {
  userFields: SettingsInterface[];
  resourceFields: SettingsInterface[];
  selected: string;
  selectedMedia: string;
}
const initialState: state = {
  userFields: null,
  resourceFields: null,
  selected: 'info',
  selectedMedia: 'text',
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.successGetUserFields, (state, action) => {
    return { ...state, userFields: action.userFields };
  }),
  on(SettingsActions.setResourceFields, (state, action) => {
    return { ...state, resourceFields: action.resourceFields };
  }),
  on(SettingsActions.changeSelectedTab, (state, action) => {
    return { ...state, selected: action.selected };
  }),
  on(SettingsActions.changeSelectedMedia, (state, action) => {
    return { ...state, selectedMedia: action.selectedMedia };
  }),
  on(SettingsActions.successPatchUserFields, (state, action) => {
    let userFields: SettingsInterface[] = JSON.parse(
      JSON.stringify([...state.userFields])
    );
    const index = userFields.findIndex(
      (userField) => userField.name === action.name
    );
    let userField = userFields[index];
    userField.value = action.visibility;
    userFields[index] = userField;
    return { ...state, userFields };
  }),
  on(SettingsActions.successPatchResourceFields, (state, action) => {
    let resourceFields: SettingsInterface[] = JSON.parse(
      JSON.stringify([...state.resourceFields])
    );
    const index = resourceFields.findIndex(
      (resourceField) => resourceField.id === action.id
    );
    let resourceField = resourceFields[index];
    resourceField.value = action.visibility;
    resourceFields[index] = resourceField;
    return { ...state, resourceFields };
  })
);
