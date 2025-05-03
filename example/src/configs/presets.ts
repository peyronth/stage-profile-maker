import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

import { tourPreset } from './tour';
import { giroPreset } from './giro';

export const presets: Record<string, Config> = {
  'tour': tourPreset,
  'giro': giroPreset
}

export const defaultPreset = tourPreset;