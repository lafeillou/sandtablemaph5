<template>
  <div class="global-map-container">

    <l-map
      ref="dengzhouMap"
      :zoom="zoom"
      :minZoom="10"
      :maxZoom="18"
      :center="center"
      :options="mapOptions"
      style="height: 100%;width:100%;"
      @leaflet:load="leafletLoaded"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <!-- <l-control-layers :position="layersPosition" :collapsed="true" :sort-layers="false" /> -->
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        layer-type="base"
      />

         <l-circle
         :key="circle.radius"
      :lat-lng="circle.center"
      :radius="circle.radius"
      :color="circle.color"
      :fillColor="circle.fillColor"
    />

      <!--自定义图层-->
      <!-- <l-geo-json :geojson="JSON.parse(item.targetLocationArea)" v-for="item in customLayers" :key="item.id" :visible="item.isOn"></l-geo-json> -->
    </l-map>

    <!-- <button @click="doTest" style="border:5px solid red;position:absolute;bottom:0;left:0;font-size:40px;z-index:9999999999">测试按钮</button> -->
    <!-- <div style="position:absolute;background-color:#000;top:0;left:0;bottom:0;right:0;z-index:9999999;color:#fff;font-size:14px;padding:50px;">
      <p v-for="item in customLayers" :key="item.id" style="color:#fff;">{{item.isOn ? 'true': 'false'}}</p>
    </div> -->
  </div>

</template>

<script>
// import { latLng } from 'leaflet'
import {
  LMap,
  LTileLayer,
  LCircle
  // LMarker,
  // LPopup,
  // LTooltip,
  // LControlZoom,
  // LControlAttribution,
  // LControlScale,
  // LControlLayers
} from 'vue2-leaflet'
import L from 'leaflet'

import { tileProviders } from '@/setting.js'

// icon映射
// import classifyIconMap from './classify-icon-map.js'

const iconMap = {
  SD: require('../assets/icons/SD.png'),
  GD: require('../assets/icons/GD.png'),
  GS: require('../assets/icons/GS.png'),
  SZF: require('../assets/icons/SZF.png'),
  SK: require('../assets/icons/SK.png'),
  HL: require('../assets/icons/HL.png'),
  TL: require('../assets/icons/TL.png'),
  JSL: require('../assets/icons/JSL.png'),
  SHL: require('../assets/icons/SHL.png'),
  QCZ: require('../assets/icons/QCZ.png'),
  HCZ: require('../assets/icons/HCZ.png'),
  XZ: require('../assets/icons/XZ.png'),
  QX: require('../assets/icons/SZF.png')
}
export default {
  name: 'DZMap',
  components: {
    LMap,
    LTileLayer,
    LCircle
    // LMarker,
    // LPopup,
    // LTooltip,
    // LControlZoom,
    // LControlAttribution,
    // LControlScale,
    // LControlLayers
  },

  computed: {
    // customLayersArr: function () {
    //   const result = []
    //   Object.keys(this.customLayers).forEach(key => {
    //     result.push(this.customLayers[key])
    //   })
    //   return result
    // }
  },
  data () {
    return {
      zoom: 14,
      center: L.latLng(35.74798822, 114.29144204),
      currentZoom: 14,
      currentCenter: null,
      showParagraph: false,
      mapOptions: {
        // zoomSnap: 0.5
        zoom: 14,
        // 不显示放大，缩小按钮，交给RN应用去操作
        zoomControl: false
      },
      // 图层控制器
      layersPosition: 'topleft',
      // 图层集合
      tileProviders: tileProviders,
      // 自定义图层集合(GeoJson格式)，点击某个目标，发送一个GeoJson,就会对应到这个map里面
      customLayers: {},
      customBgLayers: {},
      // leaflet地图实例引用
      map: null,
      // true为共显模式, false为排他模式
      showMode: true,
      // 兵力范围
      circle: {
        color: '#0e1c3d',
        center: [32.691164, 112.0875],
        radius: 0,
        fillColor: '#162a48'
      }
    }
  },
  destroyed () {
    window.Vue.$off()
    window.Vue = null
  },
  mounted () {
    this.$nextTick(() => {
      // 测试，绘制一个圆

      window.Vue.$on('zoomIn', () => {
        this.zoom = this.zoom + 1
        if (this.zoom > 18) {
          this.zoom = 18
        }
      })

      window.Vue.$on('zoomOut', () => {
        this.zoom = this.zoom - 1
        if (this.zoom < 10) {
          this.zoom = 10
        }
      })

      window.Vue.$on('switchLayer', data => {
        this.switchLayer(data.name)
      })

      window.Vue.$on('drawCircle', data => {
        // alert(data.data)
        const args = JSON.parse(data.data)
        const circle = { ...this.circle }
        circle.center = [args.targetLocation[1], args.targetLocation[0]]
        circle.radius = args.radius * 1000
        this.circle = circle
        // this.$forceUpdate()
      })
      // 响应来自RN的,高亮地图上所有目标，作为背景显示
      window.Vue.$on('dispatchAllGeoJsonDataAsBgToH5', data => {
        const targetData = JSON.parse(JSON.parse(JSON.stringify(data.data)))
        this.showMode = targetData.showMode
        // 显示背景，清除背景
        if (targetData.showMode) {
          targetData.targetList.forEach((o, index) => {
            o.targets.forEach((subO, subIndex) => {
              // 绘制GeoJson数据至某个图层上
              L.geoJSON(JSON.parse(subO.targetLocationArea), {
              // 如果是区域将被渲染如下样式
              //   style: function (feature) {
              //     return {color: feature.properties.color}
              //   }
                pointToLayer: (feature, latlng) => {
                  const iconUrl = iconMap[subO.classifyCode]
                  const iconW = 60
                  const divIcon = L.divIcon({
                    className: 'dIcon',
                    html: `<div class="marker-container" style="width:${iconW}px;height:${iconW}px"><span class="circle-no-animation"></span><img src="${iconUrl}"/></div>`,
                    iconSize: [iconW, iconW]
                  })

                  const marker = L.marker(latlng, { icon: divIcon, title: subO.targetName, zIndexOffset: 1000 })
                  marker.on('click', e => {
                    this.openRightTabsInRN(subO)
                  })
                  return marker
                },
                onEachFeature: (feature, layer) => {
                  this.customBgLayers[subO.classifyCode + '_' + subO.id] = layer
                }
              }).addTo(this.map)
            })
          })
        } else {
          // alert(this.showMode)
          // alert(JSON.stringify(this.customLayers))
          // 将其他layer移除掉
          // this.map.eachLayer((layer) => {
          //   alert(JSON.stringify(layer))
          // })

          // this.map.eachLayer(function (layer) {
          //   if (layer.name !== '地图' || layer.name !== '卫星+路网' || layer.name !== '卫星') {
          //     this.map.removeLayer(layer)
          //   }
          // })
          Object.keys(this.customBgLayers).map(obj => {
            // alert(JSON.stringify(obj))
            this.customBgLayers[obj].remove()
            delete this.customBgLayers[obj]
          })
        }
        this.$forceUpdate()
      })
      // 响应来自RN的，高亮地图点的动作
      window.Vue.$on('dispatchGeoJsonDataToH5', data => {
        const targetData = JSON.parse(JSON.parse(JSON.stringify(data.data)))
        // 绘制GeoJson数据至某个图层上
        L.geoJSON(JSON.parse(targetData.targetLocationArea), {
          // 如果是区域将被渲染如下样式
          //   style: function (feature) {
          //     return {color: feature.properties.color}
          //   }
          pointToLayer: (feature, latlng) => {
            const iconUrl = iconMap[targetData.classifyCode]
            this.map.panTo(latlng)
            const iconW = 60
            const divIcon = L.divIcon({
              className: 'dIcon',
              html: `<div class="marker-container" style="width:${iconW}px;height:${iconW}px"><span class="circle" style="background:${
              targetData.targetColor
            }"></span><img src="${iconUrl}"/></div>`,
              iconSize: [iconW, iconW]
            })

            const marker = L.marker(latlng, { icon: divIcon, title: targetData.targetName, zIndexOffset: 1000 })
            marker.on('click', e => {
              this.openRightTabsInRN(targetData)
            })
            return marker
          },
          onEachFeature: (feature, layer) => {
            // if (!this.showMode) {
            // 将其他layer移除掉
            Object.keys(this.customLayers).map(o => {
              this.customLayers[o].remove()
              delete this.customLayers[o]
            })
            // }
            this.customLayers[targetData.classifyCode + '_' + targetData.id] = layer
          }
        }).addTo(this.map)
        this.$forceUpdate()
      })
    })
  },
  methods: {
    // 切换图层
    switchLayer (layerName) {
      this.tileProviders = this.tileProviders.map(o => {
        if (o.name === layerName) {
          o.visible = true
        } else {
          o.visible = false
        }
        return o
      })
    },
    doTest () {
      const callback = function (data) {
        // alert(data.name)
        // alert(data.age)
      }
      window.APP.invokeClientMethod('getUser', { name: 'lafeillou', age: '12' }, callback)
    },

    openRightTabsInRN (data) {
      const callback = function (data) {
        // alert(JSON.stringify(data))
      }
      window.APP.invokeClientMethod('openRightTabs', { ...data }, callback)
    },
    // 地图加载完成
    leafletLoaded () {
      // this.addKmlLayer('/mapdata/邓州市矢量路网/邓州市_矢量路网/邓州市_矢量路网.kml')
      const map = this.$refs.dengzhouMap.mapObject
      this.map = map
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
      this.zoom = zoom
      const callback = function (data) {
        // alert(data.zoom)
        // alert(data.center)
      }
      window.APP.invokeClientMethod('getCenterAndZoom', { zoom: this.zoom, center: this.center }, callback)
    },
    centerUpdate (center) {
      this.center = center
      const callback = function (data) {
        // alert(data.zoom)
        // alert(data.center)
      }
      window.APP.invokeClientMethod('getCenterAndZoom', { zoom: this.zoom, center: this.center }, callback)
    }
  }
}
</script>

<style lang="scss">
.global-map-container {
  width: 100%;
  height: 100%;
  .leaflet-container{
    background-color:rgb(53, 84, 157);
  }
}

/*0%开始，100%结束*/
@keyframes scale {
  0% {
    transform: scale(1);
  }
  50%,
  75% {
    transform: scale(2);
  }
  78%,
  100% {
    opacity: 0;
  }
}

.marker-container {
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .circle {
    position: absolute;
    display: inline-block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    opacity: 0.8;
    background-color: #ffff00;
    animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
    animation-delay: 150ms;
  }

  .circle-no-animation{
    position: absolute;
    display: inline-block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    // opacity: 0.8;
    // background-color: #ffff00;
  }

  .marker-name {
    position: absolute;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
