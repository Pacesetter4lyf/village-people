import { AuthEffects } from '../auth/store/auth.effects';
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
];
