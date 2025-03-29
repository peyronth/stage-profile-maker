<template>
  <Panel
     name="Profile track"
  >
    <v-col>
      <slot
        name="gpxFileInput"
      >
      </slot>
    </v-col>
  </Panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Panel from './Panel.vue';
import FileInput from '../FileInput.vue';

export default defineComponent({
  name: 'TrackPanel',
  components: {
    Panel,
    FileInput
  },
  props: {
    gpxHelper: {
      type: Object
    }
  },
  setup() {

    return {
    };
  },
});
</script>