import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromChat from '../main/chat/store/chat.reducer';

export interface AppState {
  auth: fromAuth.state;
  chat: fromChat.state;
}

export const AppReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  chat: fromChat.chatReducer,
};
