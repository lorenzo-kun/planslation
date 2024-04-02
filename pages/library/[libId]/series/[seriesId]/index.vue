<script setup lang="ts">
import type { FullSeries } from '~/db/schema';

const { params: { seriesId } } = useRoute();

const { data } = await useFetch<FullSeries>(`/api/series/${seriesId}/chapters`);
</script>

<template>
  <div v-if="data" class="container h-screen">
    <div class="h-[5%] bg-olive shadow-md shadow-olive/50 relative">
      <title>{{ data.name }}</title>
    </div>
    <div class="lanes h-[95%]">
      <div
        v-if="data"
        class="h-full grid gap-10 p-4 bg-olive-light"
        :class="`grid-cols-${data.lanes.length}`"
      >
        <div
          v-for="lane in data.lanes"
          :key="lane.id"
          class="lane flex flex-col gap-4 justify-start align-middle text-center px-5
            bg-olive/30 rounded-md"
        >
          <title>{{ lane.title }}</title>
          <div
            v-for="chap in data.chapters.filter(c => c.currentLaneId === lane.id)"
            :key="chap.id"
            class="card flex flex-col justify-between text-left min-h-24 p-3
              bg-olive-light rounded-md shadow-md shadow-olive-strong-50"
          >
            <h1>{{ chap.shortName }}</h1>
            <p>{{ chap.assignedUserId ?? 'Unassigned' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
