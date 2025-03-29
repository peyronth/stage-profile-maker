<template>
  <VFileUpload
    :accept="$props.accept"
    :loading="loading"
    @update:model-value="onNewFile($event as unknown as File)"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { VFileUpload } from 'vuetify/labs/VFileUpload'

export default defineComponent({
  name: 'UploadZone',
  components: {
    VFileUpload,
  },
  props: {
    accept: {
      type: String,
      default: '.gpx',
    }
  },
  emits: ['update:model-value', 'update:file'],
  setup(_props, { emit }) {
    const loading = ref(false);

    const onNewFile = (file: File) => {
      emit('update:file', file);
      loading.value = true;
      const reader = new FileReader();
      reader.onload = () => {
        emit('update:model-value', reader.result);
        loading.value = false;
      };
      reader.readAsText(file);
    };

    return {
      loading,
      onNewFile,
    };
  },
});
</script>