<template>
  <div class="center_cage">
    <!--左侧一列（地图列）-->
    <div class="dataAllBorder01 cage_cl" style="margin-top: 3.5% !important; height: 62.7%; position: relative;">
      <div class="dataAllBorder02" style="position: relative; overflow: hidden;">
        <!--标题栏-->
        <div class="map_title_box" style="height: 6%">
          <div class="map_title_innerbox">
            <div class="map_title">秀洲区易涝点监测地图</div>
          </div>
        </div>
        <el-switch
            v-model="showMap"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #77aebb; float: right; margin-right: 10px; padding-left: 5px; padding-right: 5px"
            active-text=" 三维地图 "
            inactive-text=" 二维地图 "
        />
<!--        <button @click="replaceMap">点击替换地图</button>-->
        <div v-if="showMap" class="map">
          <iframe
              width="100%"
              height="100%"

              allowfullscreen
              src="https://experience.arcgis.com/experience/78a8e9b9b9a94fc290d9ebcd13876fc0/"
          ></iframe>
        </div>
        <div class="map" id="container"></div>
      </div>
    </div>

    <CameraList :listData="listData" :map="map"/>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import CameraList from "@/components/CameraList"
import {inject, ref, watch} from "vue";

export default {
  name: "LeftMap",
  components: {CameraList},
  props:{
    listData:ref(),
  },
  setup() {
    // 记得global要注入了才有
    const global = inject('global')

    let camera_list_click_code = inject('camera_list_click_code')
    const leftLng = inject("leftLng")
    const leftLat = inject("leftLat")
    const rightLat = inject("rightLat")
    const rightLng = inject("rightLng")

    return {
      map: null, //地图实例
      heatmap: null,
      AMap: null,
      global,
      markers:ref([]),
      heaters:ref([]),
      camera_list_click_code,
      rightLat,
      rightLng,
      leftLat,
      leftLng,
      showMap:ref(false),
    }
  },
  mounted() {
    this.initMap()
    let hook = this

    watch(() => {return this.camera_list_click_code;}, function (newCode){
      hook.listData.forEach(function(element) {
        if(element.code == newCode){
          console.log(element)
          hook.map.setCenter([element.lng, element.lat])
        }
      })
    })
    watch(() => { return this.listData; }, function (newArray) {
      // 数组发生变化时触发这个回调
      hook.heaters.length = 0
      hook.markers.forEach(function(element) {
        hook.map.remove(element)
      });
      hook.markers.length = 0

      for (let i = 0; i < newArray.length; i++) {
        // 创建一个 Marker 实例：
        let item = newArray[i]

        const marker = new hook.AMap.Marker({
          position: new hook.AMap.LngLat(item.lng, item.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title : item.code + "_" + item.address,
        });
         // 声明点击事件的回调函数
        marker.on('click', hook.onClick);
        hook.map.add(marker);
        hook.markers.push(marker)
        hook.heaters.push({
          "lng": item.lng,
          "lat": item.lat,
          "count": item.alertLevel
        })
      }
      hook.heatmap.setDataSet({
        data: hook.heaters,
        max: 7
      });

    }, {
      deep: true})
  },
  methods: {
    replaceMap() {
      this.showMap = !this.showMap
    },
    initMap() {
      let hook = this
      AMapLoader.load({
        key: "12e81f070a0a6b062a8caf827347b19b", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        resizeEnable: true,
        plugins: [
          "AMap.ToolBar", //工具条
          "AMap.Scale", // 比例尺
          "AMap.Geolocation", //定位
        ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        hook.AMap = AMap
        hook.map = new AMap.Map("container", { //设置地图容器id
        //这里的参数有许多可根据需要添加  点击下面《map地图参数》跳转
        viewMode: "2D", //是否为3D地图模式
            zoom: 17, //初始化地图级别
            center: [120.709047,30.764802], //初始化地图中心点位置
            animateEnable: false,
        })
        hook.map.on('moveend', hook.onMove);
        hook.map.plugin(["AMap.HeatMap"], function () {
          //初始化heatmap对象 注意this的指代变化
          hook.heatmap = new AMap.HeatMap(hook.map, {
            radius: 40, //给定半径
            opacity: [0.1, 0.5],

          });
        });
      }).catch(e => {
        console.log(e);
      })
    },

      // this.global.axios.post('/get_hot_circle').then(function (response) {
      //   // 注意内部类内使用this指代的是回调对象，而不是vue对象
      //   let circles = response.data.data
      //
      //   hook.heaters.length = 0
      //   circles.forEach(function(element) {
      //     hook.heaters.push({
      //       "lat": element.lat,
      //       "lng": element.lng,
      //       "count": element.alertLevel
      //     })
      //   });
      //   hook.heatmap.setDataSet({
      //     data: hook.heaters,
      //     max: 5
      //   });
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
    // marker点击回调函数
    onClick(e){
      let code = e.target.getTitle().split("_")[0]
      this.camera_list_click_code = code
    },

    onMove(){//地图移动事件


      //避免多次唤醒
      if(Math.abs(this.map.getBounds().northEast.lat - this.rightLat) > 0.0010 ||
          Math.abs(this.map.getBounds().northEast.lng - this.rightLng) > 0.0008){
        this.rightLat = this.map.getBounds().northEast.lat
        this.rightLng = this.map.getBounds().northEast.lng
        this.leftLat = this.map.getBounds().southWest.lat
        this.leftLng = this.map.getBounds().southWest.lng
      }
    }
  }
}

</script>
<style scoped>

</style>