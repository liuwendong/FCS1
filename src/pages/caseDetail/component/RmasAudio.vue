<template>
    <div class="audioDiv">
        <label class="audio-Tip">催收录音：</label>
        <div class="audios">
            <div class="oneAudio" v-for="(url,index) in audioLoaclUrls" :key="index">
                <audio class="audio"
                       preload="auto"
                       controls="controls"
                       :src=url
                ></audio>
                <label class="name">{{audioNames[index]}}</label>
            </div>
            <div class="oneAudio" v-for="(url,index) in this.urls" :key="index">
                <img class="img" :src="downloadBtn" @click="downloadAudio(index)"/>
                <label class="name">点击下载</label>
            </div>
        </div>
    </div>
</template>

<script>
import { Decrypt, Encrypt } from "../../../utils";
import photoUrl from "../../../../static/xiazai.png";
export default {
  name: "RmasAudio",
  data() {
    return {
      urls: [],
      audioNames: [],
      audioLoaclUrls: [],
      downloadBtn: photoUrl
    };
  },
  props: {
    item: Object
  },
  beforeMount() {
    if (this.item.audioList.length > 0) {
      this.urls = this.item.audioList.split(",");
      console.log("音频路径----- " + this.urls);
      for (let i = 0; i < this.urls.length; i++) {
        let oneUrl = this.urls[i];
        let names = oneUrl.split("/");
        let name = names[names.length - 1];
        this.audioNames.push(name);
      }
    }
  },
  methods: {
    downloadAudio(index) {
      this.$emit("downloading");
      let videoUrl = this.urls[index];
      let param = { url: videoUrl };
      console.log("开始下载录音 url= " + param);
      let encrypt = Encrypt(JSON.stringify(param));
      let self = this;
      let url =
        "api/ace-app/fileDownload/download?" +
        "parm=" +
        encodeURIComponent(encrypt);
      console.log("下载路径 url=" + url);
      self
        .$axios({
          method: "GET",
          url: url,
          responseType: "arraybuffer"
        })
        .then(res => {
          let blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformates-officedocument.spreadsheetml.sheet"
          });
          self.urls.splice(index, 1);
          self.audioLoaclUrls.push(URL.createObjectURL(blob));
          self.$emit("downloaded");
        })
        .catch(error => {
          console.log(error);
          self.$emit("downloadErr", "视频下载失败");
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .audioDiv
        margin-top: .2rem
        text-align: left
        margin-left: .4rem
        margin-bottom: -.2rem
        .audio-Tip
            font-size: .28rem
            color: $font-color
            display: block
            text-align: left
        .audios
            overflow: hidden
            .oneAudio
                float: left
                .img
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem
                    display: block
                .audio
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem
                .name
                    font-size: .05rem
                    color: #666666
                    display: block
                    width: 1.24rem
                    text-align: center
                    margin-top: .1rem
</style>
