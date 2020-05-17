<template>
  <div id="app">
    <GmapMap
  :center="{lat:10, lng:10}"
  :zoom="7"
  map-type-id="terrain"
  style="width: 500px; height: 300px"
>
  <GmapMarker
    :key="index"
    v-for="(m, index) in markers"
    :position="m.position"
    :clickable="true"
    :draggable="true"
    @click="center=m.position"
  />
</GmapMap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 10.0, lng: 10.0 },
      markers: [
        {
          position: { lat: 10.0, lng: 10.1}
        },
        {
          position: { lat: 12.0, lng: 12.0}
        }
      ]

    }
  }
  
}
</script>

<style>

</style>