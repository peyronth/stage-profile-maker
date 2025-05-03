<template>
  <TrackPanel
    v-if="profileMaker"
    :width="450"
    v-model:gpxHelper="profileMaker.gpx"
  >
    <template #gpxFileInput>
      <slot
        name="gpxFileInput"
      />
    </template>
  </TrackPanel>
  <ProfileShow
    :profileMaker="profileMaker"
    v-model:config="style"
  />
  <StylePanel
    side="right"
    :width="550"
    v-model="style"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import TrackPanel from '../components/panel/TrackPanel.vue';
import StylePanel from '../components/panel/StylePanel.vue';
import { defaultPreset } from '../configs/presets';
import ProfileShow from '../components/ProfileShow.vue';
import { ProfileMaker } from 'stage-profile-maker/src/index.ts';

export default defineComponent({
  name: 'ProfileView',
  components: {
    TrackPanel,
    StylePanel,
    ProfileShow
  },
  props: {
    gpx: {
      type: String
    }
  },
  setup(props) {
    const style = ref(defaultPreset);
    const profileMaker = ref<ProfileMaker>();

    watch(() => props.gpx, () => {
      if(!props.gpx) return;

      profileMaker.value = new ProfileMaker(props.gpx);
    }, { immediate: true });

    return {
      profileMaker,
      style
    };
  },
});
</script>
