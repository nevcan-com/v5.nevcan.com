
<template lang="pug" src="./Mapbox.pug"></template>

<script>
// The Mapbox token this map used no longer works, so the same place is shown with a keyless
// Google Maps embed, turned grey in Mapbox.sass.
export default {
  name: 'Mapbox',
  data () {
    return {
      scene: {
        lng: 28.976420,
        lat: 40.994360,
        zoom: 9
      }
    }
  },
  computed: {
    src () {
      const { lat, lng, zoom } = this.scene
      return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
    }
  }
}
</script>

<style lang="sass" src="./Mapbox.sass" scoped></style>
