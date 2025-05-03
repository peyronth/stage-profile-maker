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
          <v-col v-if="loading" cols="12" class="text-center" >
            <v-progress-circular indeterminate color="primary" />
          </v-col>
      </v-row>
    </v-card>
    <div
      class="profile-container"
      v-html="profileHtml"
    />
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, watch, type PropType } from 'vue';

import { ProfileMaker } from 'stage-profile-maker';
import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';
import { useProfileHtml } from '../composables/useProfileHtml';

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
    const { loading, html: profileHtml, getHtml } = useProfileHtml();

    const gpxHelper = computed(() => {
      return props.profileMaker?.gpx;
    });

    watch([() => props.config, () => props.profileMaker?.gpx], () => {
      getHtml(props.profileMaker, props.config);
    }, { immediate: true, deep: true });

    return {
      loading,
      gpxHelper,
      profileHtml
    };
  },
});
</script>