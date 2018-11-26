<template>
    <div class="videoDiv">
        <label class="video-Tip">催收视频：</label>
        <div class="videos">
            <div class="oneVideo" v-for="(url,index) in videoLoaclUrls" :key="index">
                <video
                        class="video"
                        :src=url
                        preload="auto"
                        controls="controls"
                />
                <label class="name">{{videoNames[index]}}</label>
            </div>
            <div class="oneVideo" v-for="(url,index) in this.urls" :key="index">
                <img class="img" :src="downloadBtn" @click="downloadVideo(index)"/>
                <label class="name">点击下载</label>
            </div>
        </div>
    </div>
</template>

<script>
import photoUrl from "../../../../static/xiazai.png";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "RmasVideo",
  data() {
    return {
      urls: [],
      videoNames: [],
      videoLoaclUrls: [],
      downloadBtn: photoUrl
    };
  },
  props: {
    item: Object
  },
  methods: {
    downloadVideo(index) {
      this.$emit("downloading");
      let videoUrl = this.urls[index];
      let param = { url: videoUrl };
      console.log("开始下载视频 url= " + param);
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
          self.videoLoaclUrls.push(URL.createObjectURL(blob));
          self.$emit("downloaded");
        })
        .catch(error => {
          console.log(error);
          self.$emit("downloadErr", "录音下载失败");
        });
    }
  },
  beforeMount() {
    if (this.item.videoList.length > 0) {
      this.urls = this.item.videoList.split(",");
      console.log("视频路径----- " + this.urls);
      for (let i = 0; i < this.urls.length; i++) {
        let oneUrl = this.urls[i];
        let names = oneUrl.split("/");
        let name = names[names.length - 1];
        this.videoNames.push(name);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .videoDiv
        margin-top: .2rem
        text-align: left
        margin-left: .4rem
        margin-right: .4rem
        .video-Tip
            font-size: .28rem
            color: $font-color
            display: block
            text-align: left
        .videos
            overflow: hidden
            .oneVideo
                float: left
                .img
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem
                    display: block
                .video
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem
                    display: block
                .name
                    font-size: .05rem
                    color: #666666
                    display: block
                    width: 1.24rem
                    text-align: center
                    margin-top: .1rem
</style>
