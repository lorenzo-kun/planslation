<script setup lang="ts">
import type { Series } from '~/db/schema';

const { params: { libId } } = useRoute();

const { data } = await useFetch<Series[]>(`/api/libraries/${libId}/series`);
</script>

<template>
  <div>
    <table>
      <thead>
        <th>Name</th>
        <th>Alias</th>
        <th>Description</th>
        <th>Links</th>
      </thead>
      <tbody>
        <tr v-for="series in data" :key="series.id">
          <td>
            <NuxtLink :to="`/library/${libId}/series/${series.alias || series.id}`">{{ series.name }}</NuxtLink>
          </td>
          <td>{{ series.alias }}</td>
          <td>{{ series.description }}</td>
          <td>{{ series.links }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
