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
            v-html="profileHtml"
          />
        </v-col>
      </v-card>
      <v-card>
        <v-btn
          @click="autoDetectClimbs()"
        >
          Auto detect climbs
        </v-btn>
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
    const profileHtml = ref('');

    const fetchData = async () => {
      const response = await fetch('/export.gpx');
      const text = await response.text();
      return text;
    };

    onMounted(async () => {
      const gpx = await fetchData();
      profile.value = new ProfileMaker(gpx);
      drawProfile();
    });

    const drawProfile = () => {
      if (profile.value) {
        profileHtml.value = profile.value.getHtml(defaultPreset);
      }
    };

    const autoDetectClimbs = () => {
      if (profile.value) {
        const climbs = profile.value.gpx.autoDetectClimbs();

        for (const climb of climbs) {
          const climbEndPoint = profile.value.gpx.getPointAtDistance(climb.to);

          profile.value.gpx.addWaypoint({
            lat: climbEndPoint.lat,
            lon: climbEndPoint.lon,
            name: `Climb ${climb.difficulty}`,
            sym: 'summit',
            cmt: '',
            desc: '',
            ele: climbEndPoint.ele,
            time: new Date(),
          });
        }

        alert(`We added ${climbs.length} climbs`);
        drawProfile();
      }
    };

    return {
      autoDetectClimbs,
      defaultPreset,
      profileHtml,
      profile
    };
  },
});
</script>