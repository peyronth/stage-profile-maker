<template>
  <slot
    name="button"
    v-bind="{ onClickButton }"
  >
    <v-icon
      block
      @click="onClickButton"
    >
      mdi-pencil-outline
    </v-icon>
  </slot>
  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <v-card
      max-width="800"
      prepend-icon="mdi-map-marker-circle"
      title="Waypoint information"
    >
    <v-sheet class="mx-auto pa-4" width="500">
      <v-form
        fast-fail
        ref="form"
      >
        <v-text-field
          v-model="trackName"
          label="Name"
          outlined
          required
          :rules="[
            (v) => !!v || 'Name is required',
            (v) => v.length <= 50 || 'Name must be less than 50 characters',
          ]"
        ></v-text-field>
        <v-text-field
          v-model="start"
          label="Start"
          outlined
          :rules="[
            (v) => !!v || 'Start is required',
            (v) => v.length <= 50 || 'Start must be less than 50 characters',
          ]"
        ></v-text-field>
        <v-text-field
          v-model="finish"
          label="Finish"
          outlined
          :rules="[
            (v) => !!v || 'Finish is required',
            (v) => v.length <= 50 || 'Finish must be less than 50 characters',
          ]"
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

import type { Config } from 'stage-profile-maker/src/interfaces/index.ts';

export default defineComponent({
  name: 'BasicInformationsButton',
  components: {
  },
  props: {
    config: {
      type: Object as PropType<Config>,
      required: true
    },
    trackName: {
      type: String,
      required: true
    }
  },
  emits: [
    'update:config',
    'update:trackName'
  ],
  setup(props, { emit }) {
    const form = ref();
    const dialog = ref(false);

    const trackName = ref("");
    const start = ref("");
    const finish = ref("");

    const onClickButton = () => {
      dialog.value = true;
    };

    const onSubmit = async () => {
      if(!form.value) {
        console.error('Form is not defined');
        return;
      }

      const formValid = await form.value.validate();
      if(!formValid.valid) {
        console.warn('Form is not valid');
        return;
      }

      if(start.value !== props.config.start.name || finish.value !== props.config.finish.name) {
        emit('update:config', {
          ...props.config,
          start: {
            ...props.config.start,
            name: start.value
          },
          finish: {
            ...props.config.finish,
            name: finish.value
          }
        });
      }
      if(trackName.value !== props.trackName) {
        emit('update:trackName', trackName.value);
      }

      dialog.value = false;
    };   

    watch(() => props.trackName, () => {
      trackName.value = props.trackName;
    }, { immediate: true });

    watch(() => props.config, (newConfig) => {
      if(newConfig.start) {
        start.value = newConfig.start.name;
      }
      if(newConfig.finish) {
        finish.value = newConfig.finish.name;
      }
    }, { immediate: true });

    return {
      form,
      start,
      finish,
      dialog,
      trackName,
      onSubmit,
      onClickButton
    };
  },
});
</script>
