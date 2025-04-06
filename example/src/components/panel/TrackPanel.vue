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
          v-for="(waypoint, distance) in waypoints"
          :key="distance"
        >
          <v-list-item-title>
            {{ waypoint.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ (distance / 1000).toFixed(2) }} km — {{ waypoint.ele || $props.gpxHelper?.getElevation(distance) }} m
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-icon
              class="me-2"
              @click="onEdit(distance)"
              aria-label="Éditer le waypoint"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              class="text-error"
              @click="onDelete(waypoint)"
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
            >Auto detect climbs</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              block
              @click="onAddWaypoint"
            >Add waypoint</v-btn>
          </v-col>
        </v-row>
      </v-list>

      <!-- Bouton en bas, garde sa taille naturelle -->
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
import Panel from './Panel.vue';
import GPXHelper from '../../../../dist/classes/GPXHelper';
import type { Waypoint } from '../../../../dist/interfaces/Gpx';

export default defineComponent({
  name: 'TrackPanel',
  components: { Panel },
  props: {
    gpxHelper: {
      type: GPXHelper,
      required: false
    }
  },
  setup(props) {
    const waypoints = computed(() => props.gpxHelper?.getWaypoints() ?? {});

    const onEdit = (distance: number) => {
      console.log('Éditer le waypoint à', distance);
    };

    const onDelete = (waypoint: Waypoint) => {
      props.gpxHelper?.deleteWaypoint(waypoint.lat, waypoint.lon);
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
          sym: 'climb',
          desc: `Auto detected climb from ${climb.from} to ${climb.to} m`,
          cmt: "",
          time: new Date()
        });
      }
    };

    const onAddWaypoint = () => {
      console.log('Add waypoint');
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
