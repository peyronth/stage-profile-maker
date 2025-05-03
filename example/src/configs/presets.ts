import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

import { tourPreset } from './tour';
import { giroPresets } from './giro';

export const presets: Record<string, Config> = {
  'tour v1': tourPreset,
  'giro v1': giroPresets[1],
  'giro v2': giroPresets[0],
}

export const defaultPreset = giroPresets[1];