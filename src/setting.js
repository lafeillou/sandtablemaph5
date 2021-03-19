// 内网： http://192.168.8.154
// 外网： http://111.47.10.117:30024
export const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://192.168.21.76' : `${window.location.origin}`

// 沙盘所属区域类型（省、市、区/县），合法范围[PROVINCE|CITY|DISTRICT]
export const areaType = 'DISTRICT'

// 沙盘所属区域名称
export const areaName = '鹤壁市'

// 地图瓦片资源路径
export const tileProviders = [
  {
    name: '卫星',
    visible: false,
    attribution: '',
    url: `${baseURL}/maps/web_mercator/satellite/{z}/{x}/{y}.png`
  },
  {
    name: '卫星+路网',
    visible: false,
    attribution: '',
    url: `${baseURL}/maps/web_mercator/satellite_with_road/{z}/{x}/{y}.png`
  },
  {
    name: '地图',
    visible: true,
    attribution: '',
    url: `${baseURL}/maps/web_mercator/road/{z}/{x}/{y}.png`
  }
]
