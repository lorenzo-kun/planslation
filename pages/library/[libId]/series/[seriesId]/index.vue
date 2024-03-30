<script setup lang="ts">
const { params: { seriesId } } = useRoute();

const { data } = await useFetch(`/api/series/${seriesId}/chapters`);
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>
