<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">GitHub Issues Graph</h1>
    <GraphView
      v-if="graphData.nodes.length > 0"
      :nodes="graphData.nodes"
      :links="graphData.links"
    />
    <p v-else>No graph data found.</p>
  </div>
</template>

<script setup lang="ts">
import GraphView from '~/components/GraphView.vue'

const { data: apiData, error } = await useFetch('/api/issues')
const { useGraphData } = await import('@/composables/useGraphData')
const graphData = useGraphData(apiData.value)

console.log('GRAPH DATA:', graphData)

if (error.value) {
  console.error('API Error:', error.value)
}
</script>
