<template>
  <div class="left_cage">
    <!--右侧一列（摄像头列）-->
    <div class="dataAllBorder01 cage_cl" style="margin-top: 9% !important; height: 50%;">
      <!--摄像头主视角-->
      <video ref="player1" class="dataAllBorder02 video_cage"
             autoplay="autoplay" preload="auto" controls="controls"/>
    </div>
    <div class="dataAllBorder01 cage_cl" style="margin-top: 1.5% !important; height: 45%;">
      <!--摄像头分视角-->
      <div class="dataAllBorder02 video_cage">

        <video ref="player2" class="video_around video_around_chose"
               muted autoplay="autoplay" preload="auto" controls="controls"/>
        <video ref="player3"  class="video_around video_around_chose"
               muted autoplay="autoplay" preload="auto" controls="controls"/>
        <video ref="player4"  class="video_around video_around_chose"
               muted autoplay="autoplay" preload="auto" controls="controls"/>
        <video ref="player5"  class="video_around video_around_chose"
               muted autoplay="autoplay" preload="auto" controls="controls"/>


      </div>
    </div>

  </div>
</template>

<script>
import {inject, ref,watch} from "vue";
import flvjs from 'flv.js';
export default {
  name: "StreamScreen",
  props:{
    listData:ref(),
  },
  setup() {
    // 记得global要注入了才有
    const camera_list_click_code = inject('camera_list_click_code')
    const global = inject('global')
    const player1 = ref()
    const player2 = ref()
    const player3 = ref()
    const player4 = ref()
    const player5 = ref()
    const flvPlayers = ref([])

    const streams = ref(['','','','',''])

    return {
      camera_list_click_code,global,player1,player2,player3,player4,player5,streams,
      flvPlayers,oldStr:['','','','',''],
      target:['','','','',''] //用于避免后发限制导致的显示bug
    }
  },
  mounted(){
    let hook = this
    setTimeout(this.init, 3000)

    watch(() => { return this.camera_list_click_code; }, function (newCode) {
      hook.destroy()

      for (let i = 0; i < hook.listData.length; i++) {
        let item = hook.listData[i]
        if(item.code != newCode){
          continue;
        }
        hook.streams.length = 0;
        for (let j = 0; j < 5; j++) {
          let ite = hook.listData[(i + j) % hook.listData.length];
          hook.target[j] = ite.stream;
          let params = ite.stream.split('_');
          hook.global.axios.post('/get_stream', {
            "channelId":params[0],
            "deviceId":params[1]
          }).then(function (response) {
            if(response.data.code == 200){
              if (ite.stream == hook.target[j]){
                hook.streams[j] = response.data.data.flv;
              }
            }else{
              console.log(response.data.code + "_" + response.data.desc);
            }

          })
          .catch(function (error) {
            console.log(error);
          });
        }
      }
    })
    // watch(() => { return this.streams; }, function (newStr) {
    //   // 仅根据变化更新
    //   let streams = []
    //   let streamPos = []
    //
    //   for (let i = 0; i < hook.oldStr.length; i++) {
    //     if(i < newStr.length){
    //       if(newStr[i] != hook.oldStr[i]){
    //         streams.push(newStr[i])
    //         streamPos.push(i)
    //       }
    //     }else {
    //       hook.destroy(hook.flvPlayers[i])
    //     }
    //   }
    //   if(hook.oldStr.length < newStr.length){
    //     for (let i = 0; i < newStr.length - hook.oldStr.length; i++) {
    //
    //       streams.push(newStr[hook.oldStr.length + i])
    //       streamPos.push(hook.oldStr.length + i)
    //     }
    //   }
    //   hook.play(streams, streamPos)
    //   // 为了让oldStr和newStr的值不同，如果直接令oldStr=newStr，因为只是传递了引用，因此会导致old和new永远相等
    //   hook.oldStr = []
    //   newStr.forEach(function (str){
    //     hook.oldStr.push(str)
    //   })
    // }, {
    //   deep: true})

    watch(() => { return this.streams; }, function (newStr) {
      console.log(newStr)
      console.log(hook.oldStr)

      for (let i = 0; i < hook.oldStr.length; i++){
        if (hook.oldStr[i] != newStr[i]){
          hook.play(newStr[i],i);
          hook.oldStr[i] = newStr[i]
        }
      }

    }, {
      deep: true})

  },
  methods: {
    init() {
      let hook = this
      if (this.listData != null && this.listData.length > 0) {
        this.streams.length = 0
        for (let j = 0; j < 5; j++) {
          let ite = this.listData[(j) % this.listData.length]
          let params = ite.stream.split('_');
          console.log(params)
          this.global.axios.post('/get_stream', {
            "channelId": params[0],
            "deviceId": params[1]
          }).then(function (response) {
            // 注意内部类内使用this指代的是回调对象，而不是vue对象
            if(response.data.code == 200){
              console.log(hook.streams)
              hook.streams[j] = response.data.data.flv
            }else{
              console.log(response.data.code + "_" + response.data.desc)
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        }

      }
    },

    // play(streams, screenPos){ // stream为需要更新的流， screenPos为更新流所在的位置
    //   let screens = [this.player1, this.player2,this.player3,this.player4,this.player5,]
    //   if (flvjs.isSupported()) {
    //     // 注意，数组streams的值是异步的，因此length无法直接得到该数组的长度,因此需要在监听或在回调中去调用该函数
    //     // console.log(streams, screenPos)
    //     let hook = this
    //     let i = 0
    //     screenPos.forEach(function(pos) {
    //       hook.flvPlayers[pos] = flvjs.createPlayer({
    //         type: 'flv',
    //         isLive: true,
    //         url: streams[i]
    //       });
    //       hook.flvPlayers[pos].attachMediaElement(screens[pos]);
    //       hook.flvPlayers[pos].load();
    //       hook.flvPlayers[pos].play();
    //       i += 1
    //     });
    //   }
    // },
    play(stream, screenPos){ // stream为需要更新的流， screenPos为更新流所在的位置
      console.log(stream,screenPos)
      let screens = [this.player1, this.player2,this.player3,this.player4,this.player5,]
      if (flvjs.isSupported()) {
        // 注意，数组streams的值是异步的，因此length无法直接得到该数组的长度,因此需要在监听或在回调中去调用该函数
        // console.log(streams, screenPos)
        let hook = this
        hook.flvPlayers[screenPos] = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: stream
        });
        hook.flvPlayers[screenPos].attachMediaElement(screens[screenPos]);
        hook.flvPlayers[screenPos].load();
        hook.flvPlayers[screenPos].play();
      }
    },
    // destroy (flvPlayer){
    //   flvPlayer.pause(); //暂停播放数据流
    //   flvPlayer.unload(); //取消数据流加载
    //   flvPlayer.detachMediaElement(); //将播放实例从节点中取出
    //   flvPlayer.destroy(); //销毁播放实例
    //   flvPlayer = null;
    // },
    destroy (){
      for (let i = 0; i < this.flvPlayers.length; i++) {
        if(this.flvPlayers[i] != null){
          this.flvPlayers[i].pause(); //暂停播放数据流
          this.flvPlayers[i].unload(); //取消数据流加载
          this.flvPlayers[i].detachMediaElement(); //将播放实例从节点中取出
          this.flvPlayers[i].destroy(); //销毁播放实例
          this.flvPlayers[i] = null;
        }
      }
    },
  },


}



</script>

<style scoped>

</style>