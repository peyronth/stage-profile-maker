<template>
  <v-container
    class="d-flex flex-column justify-space-between"
    height="100%"
  >
    <v-card
      v-if="gpxHelper"
      class="pa-4"
      width="100%"
    >
      <v-row>
          <v-card-title>
            {{ gpxHelper.getName() }}
          </v-card-title>
          <v-btn
            class="ml-auto"
            color="primary"
            @click="updateProfileHtml"
          >
            <v-icon left>mdi-refresh</v-icon>
            Update
          </v-btn>
      </v-row>
    </v-card>
    <div
      class="profile-container"
      v-html="profileHtml"
    />
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type PropType } from 'vue';

import { ProfileMaker } from 'stage-profile-maker';
import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

export default defineComponent({
  name: 'ProfileShow',
  components: {
  },
  props: {
    profileMaker: {
      type: Object as PropType<ProfileMaker>
    },
    config: {
      type: Object as PropType<Config>
    }
  },
  setup(props) {
    const profileHtml = ref<string>();

    const gpxHelper = computed(() => {
      return props.profileMaker?.gpx;
    });

    const updateProfileHtml = () => {
      if(props.config === undefined) {
        return;
      }
      profileHtml.value = props.profileMaker?.getHtml(props.config);
    };

    watch([() => props.profileMaker, () => props.config], () => {
      updateProfileHtml();
    }, { immediate: true, deep: true });

    return {
      gpxHelper,
      profileHtml,
      updateProfileHtml
    };
  },
});
</script>