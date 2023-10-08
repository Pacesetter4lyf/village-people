import { AuthEffects } from '../auth/store/effects/auth.effects';
import { chatEffects } from '../main/chat/store/chat.effects';
import { AdminEffects } from '../main/lineage/admin/store/admin.effects';
import { LineageEffects } from '../main/lineage/store/lineage.effects';
import { TreeEffects } from '../main/lineage/tree/store/tree.effects';
import { settingsEffects } from '../main/personal/settings/store/settings.effects';
import { individualEffects } from '../main/personal/store/individual.effects';
import { resourceEffects } from '../shared/store/resource.effects';

export const appEffects = [
  AuthEffects,
  individualEffects,
  resourceEffects,
  settingsEffects,
  TreeEffects,
  LineageEffects,
  AdminEffects,
  chatEffects,
];
