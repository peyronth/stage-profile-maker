import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

import { tourPreset } from './tour';
import { parisNicePreset } from './parisnice';
import { giroPresets } from './giro';

export const presets: Record<string, Config> = {
  'Tour de Fance v1': tourPreset,
  'Giro d\'Italie v1': giroPresets[1],
  'Giro d\'Italie v2': giroPresets[0],
  'Pais Nice v1': parisNicePreset,
}

export const defaultPreset = parisNicePreset;