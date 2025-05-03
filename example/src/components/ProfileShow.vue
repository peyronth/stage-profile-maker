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
          <v-col>
            <v-card-title>
              {{ gpxHelper.getName() }}
            </v-card-title>
            <v-card-subtitle
              v-if="$props.config?.start && $props.config?.finish"
            >
              {{ $props.config.start.name }} - {{ $props.config.finish.name }}
            </v-card-subtitle>
          </v-col>
          <v-col class="text-right" >
            <v-progress-circular 
              v-if="loading"
              indeterminate
              color="primary"
            />
            <BasicInformationsButton
              v-else-if="$props.config"
              :config="$props.config"
              :trackName="gpxHelper.getName()"
              @update:config="onNewConfig"
              @update:trackName="onNewTrackName"
            />
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

import { useProfileHtml } from '../composables/useProfileHtml';

import { ProfileMaker } from 'stage-profile-maker';
import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

import BasicInformationsButton from './BasicInformationsButton.vue';

export default defineComponent({
  name: 'ProfileShow',
  components: {
    BasicInformationsButton
  },
  props: {
    profileMaker: {
      type: Object as PropType<ProfileMaker>
    },
    config: {
      type: Object as PropType<Config>
    }
  },
  emits: ['update:config'],
  setup(props, { emit }) {
    const { loading, html: profileHtml, getHtml } = useProfileHtml();

    const gpxHelper = computed(() => {
      return props.profileMaker?.gpx;
    });

    watch([() => props.config, () => props.profileMaker?.gpx], () => {
      getHtml(props.profileMaker, props.config);
    }, { immediate: true, deep: true });

    const onNewTrackName = (newName: string) => {
      if(!props.profileMaker) {
        console.error('ProfileMaker is not defined');
        return;
      }
      props.profileMaker.gpx.setName(newName);
    };

    const onNewConfig = (config: Config) => {
      if(!props.config) {
        console.error('Config is not defined');
        return;
      }
      
      emit('update:config', config);
    };

    return {
      loading,
      gpxHelper,
      profileHtml,
      onNewConfig,
      onNewTrackName
    };
  },
});
</script>