<template>
  <div class="global-map-container">
    <l-map
      ref="dengzhouMap"
      :zoom="zoom"
      :minZoom="8"
      :maxZoom="18"
      :center="center"
      :options="mapOptions"
      style="height: 100%;width:100%;"
      @leaflet:load="leafletLoaded"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-control-layers :position="layersPosition" :collapsed="true" :sort-layers="false" />
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />
    </l-map>
  </div>
</template>

<script>
// import { latLng } from 'leaflet'
import {
  LMap,
  LTileLayer,
  // LMarker,
  // LPopup,
  // LTooltip,
  // LControlZoom,
  // LControlAttribution,
  // LControlScale,
  LControlLayers
} from 'vue2-leaflet'
import L from 'leaflet'

import { tileProviders } from '@/setting.js'

export default {
  name: 'DZMap',
  components: {
    LMap,
    LTileLayer,
    // LMarker,
    // LPopup,
    // LTooltip,
    // LControlZoom,
    // LControlAttribution,
    // LControlScale,
    LControlLayers
  },
  data () {
    return {
      zoom: 14,
      center: L.latLng(32.68948908, 112.08110332),
      currentZoom: 14,
      currentCenter: null,
      showParagraph: false,
      mapOptions: {
        // zoomSnap: 0.5
        zoom: 14
      },
      // 图层控制器
      layersPosition: 'topleft',
      // 图层集合
      tileProviders: tileProviders
    }
  },
  mounted () {},
  methods: {
    // 地图加载完成
    leafletLoaded () {
      // this.addKmlLayer('/mapdata/邓州市矢量路网/邓州市_矢量路网/邓州市_矢量路网.kml')
    },
    // 加载kml数据并添加到图层
    addKmlLayer (url) {
      const map = this.$refs.dengzhouMap.mapObject
      var track = new L.KML(url, { async: true })
        .on('loaded', e => {
          map.fitBounds(e.target.getBounds())
        })
        .addTo(map)
      L.control.layers({}, { Track: track }).addTo(map)
      // fetch(url)
      //   .then(res => res.text())
      //   .then(kmltext => {
      //     const parser = new DOMParser()
      //     const kml = parser.parseFromString(kmltext, 'text/xml')
      //     const track = new L.KML(kml)
      //     const map = this.$refs.dengzhouMap.mapObject
      //     map.addLayer(track)
      //     // // 调整缩放比例
      //     // const bounds = track.getBounds()
      //     // map.fitBounds(bounds)
      //   })
    },
    zoomUpdate (zoom) {
      this.currentZoom = zoom
    },
    centerUpdate (center) {
      this.currentCenter = center
    }
  }
}
</script>

<style lang="scss">
.global-map-container {
  width: 100%;
  height: 100%;
}
</style>
