<template>
  <Panel
    name="Profile style"
  > 
    <div
      :contenteditable="true"
    >
      {{ $props.modelValue }}
    </div>
  </Panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Panel from './Panel.vue';

export default defineComponent({
  name: 'StylePanel',
  components: {
    Panel
  },
  props: {
    modelValue: Object
  },
  emits: ['update:model-value'],
  setup() {

    return {
    };
  },
});
</script>