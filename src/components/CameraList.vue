<template>
  <div class="dataAllBorder01 cage_cl" style="margin-top: 0.6% !important; height: 32.1%;">
    <div class="dataAllBorder02" id="map_title_innerbox">
      <div class="map_title_box">
        <div class="map_title_innerbox">
          <div class="map_titl" style="color: #FFFFFF; padding-left: 10px; padding-top: 3px;">摄像头信息列表</div>
        </div>
        <div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%; height: 85%"
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
                @row-click="rowClick">
        <el-table-column fixed prop="code" label="编号" width="180" />
        <el-table-column prop="alert_lvl" label="风险等级" width="100" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </div>

  </div>

</template>

<script>

import {ref, watch, reactive, inject} from "vue";

export default {
  name: "CameraList",
  props: {
    listData:ref(),
    map:null
  },
  setup(){
    let tableData = ref([])
    let pos = ref(0)
    let code = ref()
    // 组件间传值应当把变量放到两者公约的父控件上，这样才能保证先提供，后注入。
    let camera_list_click_code = inject('camera_list_click_code')

    return{
      tableData, pos, code, camera_list_click_code
    }
  },
  mounted() {
    let hook = this
    watch(() => { return this.listData; }, function (newArray) {
      // 数组发生变化时触发这个回调
      hook.tableData.length = 0
      for (let i = 0; i < newArray.length; i++) {
        hook.tableData.push(reactive({
          code: newArray[i].code,
          alert_lvl: newArray[i].alertLevel > 1?"有涝情":"无涝情",
          address: newArray[i].address
        }))
      }

    }, {
      deep: true})
  },
  methods: {
    rowClick(row){
      // 点击表格的回调，row为表格中填充的数据
      let hook = this
      this.listData.forEach(function(element) {
        if(element.code == row.code){
          hook.camera_list_click_code = row.code
        }
      })
    }
  }
}
</script>

<style scoped>

</style>