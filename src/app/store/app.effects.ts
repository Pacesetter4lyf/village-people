import { AuthEffects } from '../auth/store/auth.effects';
import { settingsEffects } from '../main/personal/settings/store/settings.effects';
import { individualEffects } from '../main/personal/store/individual.effects';
import { resourceEffects } from '../shared/store/resource.effects';

export const appEffects = [AuthEffects, individualEffects, resourceEffects, settingsEffects];
