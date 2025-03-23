<template>
  <v-app>
    <v-app-bar
      app
      color="background"
      dark
    >
      <v-toolbar-title>Mon Viewer GPX</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com"
        target="_blank"
      >
        Documentation
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-card
        v-if="profile"
      >
        <v-col>
            <h2>{{ profile.gpx.getName() }}</h2>
          <v-row>
            <v-col>
              <h4>
                {{ (profile.gpx.getDistance() / 1000).toFixed(2) }} km
              </h4>
              <h4>
                {{ profile.gpx.getElevationGain().toFixed(2) }} m+
              </h4>
            </v-col>
            <v-col>
              <h4>
                {{ profile.gpx.getElevationGain().toFixed(0) }} m+
              </h4>
              <h4>
                {{ profile.gpx.getElevationLoss().toFixed(0) }} m-
              </h4>
            </v-col>
            <v-col>
              <h4>
                Max : {{ profile.gpx.getMaxAltitude().toFixed(0) }} m
              </h4>
              <h4>
                Min : {{ profile.gpx.getMinAltitude().toFixed(0) }} m
              </h4>
            </v-col>
          </v-row>
          <div
            class="profile-container"
            v-html="profile.getHtml(defaultPreset)"
          />
        </v-col>
      </v-card>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { defaultPreset } from './configs/presets';

import { ProfileMaker } from 'stage-profile-maker';

export default defineComponent({
  name: 'App',
  setup() {

    const profile = ref<ProfileMaker | null>(null);

    const fetchData = async () => {
      const response = await fetch('/export.gpx');
      const text = await response.text();
      return text;
    };

    onMounted(async () => {
      const gpx = await fetchData();
      profile.value = new ProfileMaker(gpx);
    });

    return {
      defaultPreset,
      profile
    };
  },
});
</script>