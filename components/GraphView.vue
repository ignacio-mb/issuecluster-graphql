<template>
  <div ref="graphRef" class="graph-container" />
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  nodes: { id: string; title: string; url: string; group: number }[]
  links: { source: string; target: string; weight: number }[]
}>()

const graphRef = ref<HTMLElement | null>(null)

function drawGraph() {
  if (!graphRef.value) return

  graphRef.value.innerHTML = '' // clear previous graph
  const width = graphRef.value.clientWidth
  const height = graphRef.value.clientHeight

  const svg = d3
    .select(graphRef.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const simulation = d3
    .forceSimulation(props.nodes)
    .force('link', d3.forceLink(props.links).id((d: any) => d.id).distance(50))
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))

  let link: any = []
  if (props.links.length > 0) {
    link = svg
      .append('g')
      .attr('stroke', '#aaa')
      .selectAll('line')
      .data(props.links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.weight))
  }

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(props.nodes)
    .join('circle')
    .attr('r', 6)
    .attr('fill', d => {
      if (d.group === 1) return 'green'   // OPEN
      if (d.group === 0) return 'purple'  // CLOSED
      return 'gray'
    })
    .on('click', (event, d) => {
      const url = (d as any).url
      if (url) window.open(url, '_blank')
    })
    .call(
      d3
        .drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
    )
  
  console.log('Graph nodes preview:', props.nodes.slice(0, 5))
  
  node.each(function (d) {
  d3.select(this)
    .append('title')
    .text((d: any) => `#${d.id}: ${d.title || ''}`)
})

  simulation.on('tick', () => {
    if (props.links.length > 0) {
      link
        .attr('x1', d => (d as any).source.x)
        .attr('y1', d => (d as any).source.y)
        .attr('x2', d => (d as any).target.x)
        .attr('y2', d => (d as any).target.y)
    }

    node
      .attr('cx', d => (d as any).x)
      .attr('cy', d => (d as any).y)
  })

  function dragStarted(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event: any, d: any) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragEnded(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
}

onMounted(() => {
  drawGraph()
})

watch(() => props.nodes, drawGraph)
watch(() => props.links, drawGraph)
</script>

<style scoped>
.graph-container {
  width: 100%;
  height: 600px;
  background-color: #f5f5f5;
  border: 2px solid #ccc;
}
</style>
