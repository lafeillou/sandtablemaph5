<template>
  <div id="app">
    <DZMap />
  </div>
</template>

<script>

import DZMap from '@/views/DZMap.vue'

export default {
  name: 'appRoot',
  components: {
    DZMap
  }
}
</script>
<style lang="scss">
html,body{
  height:100%;
  width:100%;
  margin:0;
  padding:0;
}
#app{
  width:100%;
  height:100%;
}
// leaflet 全局样式
.leaflet-bottom.leaflet-right {
  // 消除版权
  display:none !important;
}
// 对leaflet全局样式的改写
.leaflet-container{

}
</style>
