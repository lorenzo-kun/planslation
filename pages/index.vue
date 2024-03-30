<script setup lang="ts">
import type { Library } from '~/db/schema';

const { data } = await useFetch<Library[]>('/api/libraries');
</script>

<template>
  <div>
    <div v-for="lib in data" :key="lib.id">
      <NuxtLink :to="`/library/${lib.alias || lib.id}`">
        GO TO {{ lib.name }}
      </NuxtLink>
    </div>
  </div>
</template>
