<template>
  <Panel
    name="Profile style"
  > 
    <SelectProfilePreset
      :modelValue="actualPreset"
      @update:model-value="onNewPreset"
    />
  </Panel>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';

import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

import { presets } from '../../configs/presets';

import Panel from './Panel.vue';
import SelectProfilePreset from '../SelectProfilePreset.vue';

export default defineComponent({
  name: 'StylePanel',
  components: {
    Panel,
    SelectProfilePreset
  },
  props: {
    modelValue: {
      type: Object as PropType<Config>,
      required: true
    }
  },
  emits: ['update:model-value'],
  setup(_props, { emit }) {
    const actualPreset = ref<string | null>(null);

    const onNewPreset = (newPreset: string) => {
      const modelValue= presets[newPreset] as Config;

      if (!modelValue) {
        console.error(`Preset ${newPreset} not found`);
        return;
      }
      actualPreset.value = newPreset;
      emit('update:model-value', modelValue);
    };

    return {
      actualPreset,
      onNewPreset
    };
  },
});
</script>