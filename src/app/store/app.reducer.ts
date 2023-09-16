import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromChat from '../main/chat/store/chat.reducer';
import * as fromIndividual from '../main/personal/store/individual.reducer';
import * as fromResource from '../shared/store/resource.reducer';
import * as fromSettings from '../main/personal/settings/store/settings.reducer';

export interface AppState {
  auth: fromAuth.state;
  chat: fromChat.state;
  individual: fromIndividual.state;
  resource: fromResource.state;
  settings: fromSettings.state;
}

export const AppReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  chat: fromChat.chatReducer,
  individual: fromIndividual.individualReducer,
  resource: fromResource.resourceReducer,
  settings: fromSettings.settingsReducer,
};
