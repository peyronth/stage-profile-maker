<template>
  Hello
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { ProfileMaker } from 'stage-profile-maker';

export default defineComponent({
  name: 'App',
  setup() {
    // get gpx file content from ./assets/export.gpx
    const fetchData = async () => {
      const response = await fetch('./assets/export.gpx');
      const text = await response.text();
      return text;
    };

    onMounted(async () => {
      const gpx = await fetchData();
      const profileMaker = new ProfileMaker(gpx);
    });

    return {};
  },
});


</script>




