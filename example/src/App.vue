<template>
  <v-app>
    <v-app-bar
      app
      color="background"
      dark
    >
      <v-toolbar-title>Stage profile maker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/peyronth/stage-profile-maker"
        target="_blank"
      >
        Documentation
      </v-btn>
    </v-app-bar>
    <v-main
      :scrollable="false"
    >
      <v-container
        v-if="!gpx"
        width="100%"
        height="100%"
        class="pa-10"
      >
        <UploadZone
          height="100%"
          v-model:file="gpxFile"
          @update:model-value="onNewGpx($event)"
        />
      </v-container>
      <ProfileView
        v-else
        :gpx="gpx"
      >
        <template #gpxFileInput>
          <FileInput
            v-model:file="gpxFile"
            @update:model-value="onNewGpx($event)"
          />
        </template>
      </ProfileView>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import UploadZone from './components/UploadZone.vue';
import ProfileView from './views/ProfileView.vue';
import FileInput from './components/FileInput.vue';

export default defineComponent({
  name: 'App',
  components: {
    ProfileView,
    UploadZone,
    FileInput
  },
  setup() {
    const gpx = ref<string>();
    const gpxFile = ref<File>();

    const onNewGpx = (newGpx: string) => {
      gpx.value = newGpx;
    };

    return {
      gpx,
      gpxFile,
      onNewGpx,
    };
  },
});
</script>