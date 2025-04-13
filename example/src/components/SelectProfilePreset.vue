<template>
  <v-container
    class="pa-4"
    fluid
  >
    <v-select
      :items="items"
      :modelValue="modelValue"
      @update:model-value="$emit('update:model-value', $event)"
      label="Select a profile preset"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { presets } from '../configs/presets';

export default defineComponent({
  name: 'SelectProfilePreset',
  components: {
  },
  props: {
    modelValue: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  emits: ['update:model-value'],
  setup() {
    const items = Object.keys(presets);

    return {
      items
    };
  },
});
</script>