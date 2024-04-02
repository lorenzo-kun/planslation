<script setup lang="ts">
import type { Chapter, Series, SeriesLane } from '~/db/schema';

const { params: { seriesId } } = useRoute();

type ReturnedSeries = Series & {
  chapters: Chapter[],
  lanes: SeriesLane[]
}
const { data } = await useFetch<ReturnedSeries>(`/api/series/${seriesId}/chapters`);
</script>

<template>
  <div class="header">
    <title>{{ data!.name }}</title>
  </div>
  <div class="lanes">
    <div v-if="data" class="h-screen bg-olive-light grid gap-10"
      :class="`grid-cols-${data.lanes.length}`"
    >
      <div v-for="lane in data.lanes" class="lane flex grow justify-center">
        <title>{{ lane.title }}</title>
        <div v-for="chap in data.chapters.filter(c => c.currentLaneId === lane.id)" class="card">
          <title>{{ chap.shortName }}</title>
        </div>
      </div>
    </div>
  </div>
</template>
