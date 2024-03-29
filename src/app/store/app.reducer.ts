import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/reducer/auth.reducer';
import * as fromChat from '../main/chat/store/chat.reducer';
import * as fromIndividual from '../main/personal/store/individual.reducer';
import * as fromResource from '../shared/store/resource.reducer';
import * as fromSettings from '../main/personal/settings/store/settings.reducer';
import * as fromTree from '../main/lineage/tree/store/tree.reducer';
import * as fromLineage from '../main/lineage/store/lineage.reducer';
import * as fromAdmin from '../main/lineage/admin/store/admin.reducer';
export interface AppState {
  auth: fromAuth.state;
  chat: fromChat.state;
  individual: fromIndividual.state;
  resource: fromResource.state;
  settings: fromSettings.state;
  tree: fromTree.state;
  lineage: fromLineage.state;
  admin: fromAdmin.state;
}

export const AppReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  chat: fromChat.chatReducer,
  individual: fromIndividual.individualReducer,
  resource: fromResource.resourceReducer,
  settings: fromSettings.settingsReducer,
  tree: fromTree.treeReducer,
  lineage: fromLineage.lineageReducer,
  admin: fromAdmin.adminReducer,
};
