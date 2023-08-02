<template>
  <div class="data_bodey">
    <div class="index_nav">
      <ul style="height: 30px; margin-bottom: 0px;">
        <!--<li class="l_left total_chose_fr" onclick="analysis()">实时监测</li>-->
        <!--<li class="l_left total_chose_pl" onclick="department()">生产分析</li>-->
        <!--<li class="l_left total_chose_pl">销售分析</li>-->
        <!--<li class="r_right total_chose_pl">安全分析</li>-->
        <!--<li class="r_right total_chose_pl">人员分析</li>-->
        <!--<li class="r_right total_chose_pl">管理分析</li>-->
      </ul>
      <div class="total_chose_box" style="display: none;">
        <div style="height: 32px;"></div>
        <span class="chose_tltle">请选择年份：</span>
        <select class="year_chose">
          <option>2017</option>
          <option>2016</option>
          <option>2015</option>
          <option>2014</option>
          <option>2013</option>
          <option>2012</option>
        </select>
        <span class="chose_tltle">请输入月份：</span>
        <input class="chose_text_in">
        <span class="chose_tltle">请选择区域：</span>
        <select class="year_chose">
          <option> 成都市</option>
          <option>自贡市</option>
          <option>攀枝花市</option>
          <option>泸州市</option>
          <option>德阳市</option>
          <option>绵阳市</option>
          <option>广元市</option>
          <option>遂宁市</option>
          <option>内江市</option>
          <option>乐山市</option>
          <option>南充市</option>
          <option>宜宾市</option>
          <option>广安市</option>
          <option>达州市</option>
          <option>巴中市</option>
          <option>雅安市</option>
          <option>眉山市</option>
          <option>资阳市</option>
          <option>阿坝州</option>
          <option>甘孜州</option>
          <option>凉山州</option>
        </select>
        <button class="chose_enter">确定</button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="index_tabs">
      <!--安防运作-->
      <div class="inner" style="height: 109%;">
        <StreamScreen :listData="listData"/>
        <LeftMap :listData="listData"/>
      </div>
    </div>
  </div>
</template>

<script>
import StreamScreen from "@/components/StreamScreen";
import LeftMap from "@/components/LeftMap";
import {inject, provide, ref, watch} from "vue";

export default {
  data(){
    const global = inject('global')
    let camera_list_click_code = ref()
    provide("camera_list_click_code", camera_list_click_code);
    let rightLat = ref(0)
    let rightLng = ref(0)
    let leftLat = ref(0)
    let leftLng = ref(0)
    // 必须要先provide才能inject，因此provide必在父控件上
    provide("rightLat", rightLat)
    provide("rightLng", rightLng)
    provide("leftLat", leftLat)
    provide("leftLng", leftLng)
    const range = [leftLng, leftLat, rightLat, rightLng]
    return {global,listData:ref([]),
    leftLng,leftLat,rightLat,rightLng, range}
  },
  name: 'HelloWorld',
  components: {LeftMap, StreamScreen},
  mounted() {
    let hook = this
    // setTimeout(this.refreshList, 2000)
    // setInterval(this.refreshList, 10000)
    watch(()=>{return hook.leftLng}, () => {
      // 未证实，.value取得是值，直接等于取得是对象
      hook.refreshList()
    }, {deep:true})
  },
  methods:{
    refreshList() {

      let hook = this
      hook.global.axios.post('/get_camera_list', {
        "leftLat":hook.leftLat,
        "leftLng":hook.leftLng,
        "rightLat":hook.rightLat,
        "rightLng":hook.rightLng,
      }).then(function (response) {
        // 注意内部类内使用this指代的是回调对象，而不是vue对象
        hook.listData.length = 0
        // console.log(response)
        response.data.data.forEach(function(element) {
          hook.listData.push(element)
        });
      })
      .catch(function (error) {
        console.log(error);
      });
   }
  }
}
</script>
