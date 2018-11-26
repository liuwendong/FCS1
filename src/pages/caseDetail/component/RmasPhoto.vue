<template>
    <div class="photoDiv">
        <label class="photo-Tip">催收图片：</label>
        <img :src="testUrl"/>
        <div class="photos">
            <img
                    v-for="(oneItem,index) in photoLocalUrls"
                    :key="index"
                    preview="preview"
                    class="photo"
                    :src= oneItem
            />
        </div>
    </div>
</template>

<script>
import photoUrl from "../../../../static/photo@2x.png";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "RmasPhoto",
  data() {
    return {
      urls: [],
      photoUrl: photoUrl,
      testUrl: "",
      photoLocalUrls: [],
      photoNum: 0
    };
  },
  props: {
    item: Object,
      preview:String
  },
  beforeMount() {
    this.urls = this.item.photoList.split(",");
    for (let i = 0; i < this.urls.length; i++) {
      this.downloadPhoto(this.urls[i]);
    }
  },
  methods: {
    downloadPhoto(photoUrl) {
      this.$emit("downloading");
      console.log("请求下载图片 图片路径URL=" + photoUrl);
      let param = { url: photoUrl };
      let paramJson = JSON.stringify(param);
      console.log(paramJson);
      let encrypt = Encrypt(paramJson);
      let self = this;
      let url =
        "/api/ace-app/fileDownload/download?" +
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
          let localUrl = URL.createObjectURL(blob);
          console.log("图片下载后 本地路径 url=" + localUrl);
          self.photoLocalUrls.push(localUrl);
          self.photoNum++;
          if (self.photoNum == this.urls.length) {
            self.$emit("downloaded");
          }
        })
        .catch(error => {
          console.log(error);
          self.$emit("downloadErr",'图片下载失败');
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .photoDiv
        margin-top: .2rem
        text-align: left
        margin-left: .4rem
        .photo-Tip
            font-size: .28rem
            color: $font-color
            display: block
            text-align: left
        .photos
            .photo
                width: 1.24rem
                height: 1.24rem
                padding-top: .2rem
                padding-right: .4rem
</style>
