<template>
  <div class="left_cage">
    <!--右侧一列（摄像头列）-->
    <div class="dataAllBorder01 cage_cl" style="margin-top: 9% !important; height: 50%;">
      <!--摄像头主视角-->
      <img src="../assets/1.jpg" class="dataAllBorder02 video_cage">
    </div>
    <div class="dataAllBorder01 cage_cl" style="margin-top: 1.5% !important; height: 45%;">
      <!--摄像头分视角-->
      <div class="dataAllBorder02 video_cage">

        <img src="../assets/radi01.jpg" class="video_around video_around_chose">
        <img src="../assets/radi01.jpg" class="video_around video_around_chose">
        <img src="../assets/radi01.jpg" class="video_around video_around_chose">
        <img src="../assets/radi01.jpg" class="video_around video_around_chose">


      </div>
    </div>

  </div>
</template>

<script>
import {inject, ref, watch} from "vue";
export default {
  name: "StreamScreen",
  props:{
    listData:ref(),
  },
  setup() {
    // 记得global要注入了才有
    const camera_list_click_code = inject('camera_list_click_code')

    return {
      camera_list_click_code,
    }
  },
  mounted(){
    watch(() => { return this.camera_list_click_code; }, function (newCode) {
      // 数组发生变化时触发这个回调
      console.log(newCode)
    }, {
      deep: true})
  },
  methods: {

  },

}



</script>

<style scoped>

</style>