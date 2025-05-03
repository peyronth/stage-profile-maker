<template>
  <Panel
    name="Profile track"
    class="d-flex flex-column"
  >
    <v-col class="d-flex flex-column pa-2">
      <!-- Garde sa taille naturelle -->
      <div class="mb-2">
        <slot name="gpxFileInput"></slot>
      </div>

      <v-list class="pa-2">
        <v-list-item
          v-for="waypointObj in waypoints"
          :key="waypointObj.distance"
        >
          <v-list-item-title>
            {{ waypointObj.waypoint.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ (waypointObj.distance / 1000).toFixed(2) }} km — {{ waypointObj.waypoint.ele || $props.gpxHelper?.getElevation(waypointObj.distance) }} m
          </v-list-item-subtitle>

          <template v-slot:append>
            <WaypointButton
              v-if="$props.gpxHelper"
              :gpxHelper="$props.gpxHelper"
              :model-value="waypointObj.waypoint"
              @update:model-value="onEdit(waypointObj.waypoint, $event)"
              @delete="onDelete(waypointObj.waypoint)"
            >
              <template
                v-slot:button="{ onClickButton }"
              >
                <v-icon
                  aria-label="Éditer le waypoint"
                  @click="onClickButton"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </WaypointButton>
            <v-icon
              class="text-error"
              @click="onDelete(waypointObj.waypoint)"
              aria-label="Supprimer le waypoint"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-list-item>


        <v-row
          dense
          class="w-100"
        >
          <v-col cols="6">
            <v-btn
              block
              @click="onAutoDetect"
            >
              Auto detect climbs
            </v-btn>
          </v-col>
          <v-col cols="6">
            <WaypointButton
              v-if="$props.gpxHelper"
              :gpxHelper="$props.gpxHelper"
              @update:model-value="onAddWaypoint"
            />
          </v-col>
        </v-row>
      </v-list>

      <div class="mt-2">
        <v-btn
          color="primary"
          block
          @click="onDownload"
        >
          Download GPX
        </v-btn>
      </div>
    </v-col>
  </Panel>
</template>


<script lang="ts">
import { computed, defineComponent } from 'vue';

import GPXHelper from 'stage-profile-maker/src/classes/GPXHelper.ts';
import type { Waypoint } from 'stage-profile-maker/src/interfaces/index.ts';

import Panel from './Panel.vue';
import WaypointButton from '../WaypointButton.vue';

export default defineComponent({
  name: 'TrackPanel',
  components: {
    Panel,
    WaypointButton
  },
  props: {
    gpxHelper: {
      type: GPXHelper,
      required: false
    }
  },
  setup(props) {
    const waypoints = computed(() => {
      const rawWaypoints = props.gpxHelper?.getWaypoints() ?? {};

      return Object.keys(rawWaypoints)
        .map((distanceStr) => {
          const distance = Number(distanceStr);
          const waypoint = rawWaypoints[distance];
          return { distance, waypoint };
        })
        .sort((a, b) => a.distance - b.distance);
  });

    const onEdit = (oldValue: Waypoint, newValue: Waypoint) => {
      if(!props.gpxHelper) {
        console.error('GPXHelper is not defined');
        return;
      }

      props.gpxHelper.deleteWaypoint(oldValue.lat, oldValue.lon);
      props.gpxHelper.addWaypoint(newValue);
    };

    const onDelete = (waypoint: Waypoint) => {
      if(!props.gpxHelper) {
        console.error('GPXHelper is not defined');
        return;
      }
      props.gpxHelper.deleteWaypoint(waypoint.lat, waypoint.lon);
    };

    const onAutoDetect = () => {
      if(!props.gpxHelper) {
        console.error('GPXHelper is not defined');
        return;
      }

      const detectedClimbs = props.gpxHelper.autoDetectClimbs();

      if(!detectedClimbs) {
        alert('No climbs detected');
        return;
      }
      
      for (const climb of detectedClimbs) {
        const topNearestPoint = props.gpxHelper.getPointAtDistance(climb.to);

        props.gpxHelper?.addWaypoint({
          lat: topNearestPoint.lat,
          lon: topNearestPoint.lon,
          ele: topNearestPoint.ele,
          name: `Auto detected climb`,
          sym: climb.difficulty,
          desc: `Auto detected climb from ${climb.from} to ${climb.to} m`,
          cmt: "",
          time: new Date()
        });
      }
    };

    const onAddWaypoint = (waypoint: Waypoint) => {
      if(!props.gpxHelper) {
        console.error('GPXHelper is not defined');
        return;
      }

      props.gpxHelper.addWaypoint(waypoint);
    };

    const onDownload = () => {
      const xml = props.gpxHelper?.exportGPX();
      if (!xml) {
        console.error('Error while exporting GPX');
        return;
      }
      const blob = new Blob([xml], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'track.gpx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return {
      waypoints,
      onEdit,
      onDelete,
      onAutoDetect,
      onAddWaypoint,
      onDownload
    };
  }
});
</script>
