<template>
  <slot
    name="button"
    v-bind="{ onClickButton }"
  >
    <v-btn
      block
      @click="onClickButton"
    >
      Add waypoint
    </v-btn>
  </slot>
  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <v-card
      max-width="800"
      prepend-icon="mdi-map-marker-circle"
      title="Waypoint informations"
    >
    <v-sheet class="mx-auto pa-4" width="500">
      <v-form
        fast-fail
        ref="form"
      >
        <v-text-field
          v-model="waypointName"
          label="Waypoint name"
          outlined
          required
          :rules="[
            (v) => !!v || 'Name is required',
            (v) => v.length <= 50 || 'Name must be less than 50 characters',
          ]"
        ></v-text-field>
        <v-text-field
          v-model="waypointDescription"
          label="Waypoint description"
          outlined
          :rules="[
            (v) => !v || v.length <= 200 || 'Description must be less than 200 characters',
          ]"
        ></v-text-field>
        <v-select
          v-model="waypointType"
          :items="Object.values(SprintTypes)"
          label="Waypoint type"
          outlined
          required
          :rules="[
            (v) => !!v || 'Type is required',
          ]"
        ></v-select>
        <v-text-field
          v-model="elevation"
          label="Elevation (m)"
          type="number"
          outlined
          :rules="[
            (v) => !v || v > -1000 || 'Elevation must be greater than -1000',
          ]"
        ></v-text-field>
        <v-text-field
          :model-value="(distance ?? 0) / 1000"
          label="Distance (km)"
          type="number"
          outlined
          :rules="[
            (v) => !v || v > 0 || 'Distance must be greater than 0',
          ]"
          @update:model-value="($event: string) => distance = +$event * 1000"
        ></v-text-field>
      </v-form>
    </v-sheet>
      <template v-slot:actions>
        <v-row justify="end" class="px-4 pb-4 ga-2" no-gutters>
          <v-btn color="grey" variant="outlined" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="onSubmit">Submit</v-btn>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue';

import GPXHelper from 'stage-profile-maker/src/classes/GPXHelper.ts';
import { SprintTypes } from 'stage-profile-maker/src/enums/SprintTypes.ts';
import type { Waypoint } from 'stage-profile-maker/src/interfaces/index.ts';

export default defineComponent({
  name: 'AddWaypointButton',
  components: {
  },
  props: {
    modelValue: {
      type: Object as PropType<Waypoint | null>,
      default: null,
    },
    gpxHelper: {
      type: GPXHelper,
      required: true
    }
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const form = ref();
    const dialog = ref(false);

    const waypointName = ref('');
    const waypointDescription = ref('');
    const waypointType = ref<SprintTypes | null>(SprintTypes.Location);
    const elevation = ref<number | null>(null);
    const distance = ref<number | null>(null);

    const onClickButton = () => {
      dialog.value = true;
    };

    const onSubmit = async () => {
      if(!form.value) {
        console.error('Form is not defined');
        return;
      }

      const formValid = await form.value.validate();
      if(!formValid.valid || !distance.value || !waypointType.value) {
        console.warn('Form is not valid');
        return;
      }

      const routePoint = props.gpxHelper.getPointAtDistance(distance.value)

      const waypoint: Waypoint = {
        name: waypointName.value,
        desc: waypointDescription.value,
        sym: waypointType.value,
        ele: elevation.value,
        cmt: '',
        lat: routePoint.lat,
        lon: routePoint.lon,
        time: routePoint.time
      };

      emit('update:model-value', waypoint);
      dialog.value = false;
    };

    watch(() => props.modelValue, (value) => {
      if(!value) {
        waypointName.value = '';
        waypointDescription.value = '';
        waypointType.value = SprintTypes.Location;
        elevation.value = null;
        distance.value = null;

        return;
      }

      waypointName.value = value.name;
      waypointDescription.value = value.desc;
      waypointType.value = Object.values(SprintTypes).includes(value.sym as SprintTypes) ? (value.sym as SprintTypes) : SprintTypes.Location;
      elevation.value = value.ele;
      distance.value = props.gpxHelper.getDistanceAtPoint(value.lat, value.lon);
    }, { immediate: true });

    watch(distance, (value) => {
      if(!value) {
        elevation.value = null;
        return;
      }
      elevation.value = props.gpxHelper.getPointAtDistance(value).ele;
    });

    return {
      form,
      dialog,
      distance,
      elevation,
      SprintTypes,
      waypointName,
      waypointType,
      waypointDescription,
      onSubmit,
      onClickButton
    };
  },
});
</script>
