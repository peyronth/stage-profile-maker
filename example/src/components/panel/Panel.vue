<template>
  <v-navigation-drawer
    :model-value="isOpen"
    :location="side"
    :permanent="true"
    v-bind="$attrs"
  >
    <v-toolbar flat>
      <v-toolbar-title>
        {{ $props.name }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="isOpen = !isOpen">
        <v-icon>
          {{ side === 'left' ? 'mdi-chevron-left' : 'mdi-chevron-right' }}
        </v-icon>
      </v-btn>
    </v-toolbar>
    <slot />
  </v-navigation-drawer>
  <v-navigation-drawer
    :model-value="!isOpen"
    :width="34"
    :location="side"
    :permanent="true"
  >
    <v-toolbar flat>
      <v-icon
        class="ms-1"
        @click="isOpen = !isOpen"
      >
        {{ $props.side === 'left' ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
      </v-icon>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

export default defineComponent({
  name: 'Panel',
  props: {
    side: {
      type: String as PropType<'left' | 'right'>,
      default: 'left'
    },
    name: {
      type: String,
      default: 'Panel'
    }
  },
  setup() {
    const isOpen = ref(true);

    return {
      isOpen
    };
  }
});
</script>
