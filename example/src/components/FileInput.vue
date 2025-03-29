<template>
  <v-file-input
    :accept="accept"
    :loading="loading"
    :model-value="file"
    :clearable="false"
    @update:model-value="onNewFile($event as unknown as File)"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { VFileInput } from 'vuetify/components';

export default defineComponent({
  name: 'FileInput',
  components: {
    VFileInput,
  },
  props: {
    accept: {
      type: String,
      default: '.gpx',
    },
    file: {
      type: File
    },
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
