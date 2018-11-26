<template>
    <div class="videoDiv border-bottom">
        <label class="photo-Tip">催收视频：</label>
        <div class="upload_warp">
            <div class="upload_warp_img" v-show="showVideo">
                <div class="upload_warp_img_div"
                     v-for="(item,index) in videoList"
                     :key="index"
                >
                    <img src="~imgUrl/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">
                    <video
                            :src="item"
                            preload="auto"
                            controls="controls"
                            class="upload_warp_img_div_img"
                    >
                    </video>
                </div>
            </div>
            <div class="videos">
                <img class="video" src="~imgUrl/add@2x.png" @click.stop="fileClick()"/>
                <input
                        type="file"
                        multiple
                        ref="uploadImage"
                        @change="fileChange($event)"
                        accept="video/*"
                        name="file"
                        style="display: none"
                        id="upload_file_video"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "AddVideo",
  data() {
    return {
      videoList: [],
      videoFiles: [],
      videoUrls: [],
      upErr: false
    };
  },
  props: {
    beginUp: Boolean,
    caseSubId: String
  },
  watch: {
    beginUp(newVal) {
      if (newVal === true) {
        let self = this;
        self.upErr = false;
        if (this.videoFiles.length > 0) {
          var succNum = 0;
          console.log("开始上传视频");
          for (let i = 0; i < this.videoFiles.length; i++) {
            if (self.upErr) break;
            let file = this.videoFiles[i];
            let param = new FormData();
            param.append("file", file, file.name);
            let config = { headers: { "Content-Type": "multipart/form-data" } };
            let url =
              "api/ace-app/collectionVideo/videoAdd?caseSubId=" +
              self.caseSubId;
            this.$axios
              .post(url, param, config)
              .then(response => {
                let mydata = response.data;
                if (mydata.message == "上传成功") {
                  succNum++;
                  //保存返回的URL
                  let url = mydata.data;
                  self.videoUrls.push(url);
                  if (succNum == this.videoFiles.length) {
                    //视频上传完
                    self.$emit("videoUpFinish", self.videoUrls);
                  }
                } else {
                  self.upErr = true;
                  self.$emit("videoUpErr");
                }
              })
              .catch(error => {
                console.log(error);
                self.upErr = true;
                self.$emit("videoUpErr");
              });
          }
        } else {
          self.$emit("videoUpFinish", self.videoUrls);
        }
      }
    }
  },
  methods: {
    fileClick() {
      console.log("点击了添加");
      let imgSel = document.getElementById("upload_file_video");
      console.log(imgSel);
      const event = new MouseEvent("click");
      imgSel.dispatchEvent(event);
    },

    fileDel(index) {
      let self = this;
      self.videoList.splice(index, 1);
    },
    fileChange(el) {
      let self = this;
      for (let i = 0; i < el.target.files.length; i++) {
        let file = el.target.files[i];
        console.log(file);
        var url = self.getFileURL(file);
        self.videoList.push(url);
        self.videoFiles.push(file);
      }
    },
    getFileURL(file) {
      var getUrl = null;
      if (window.createObjectURL != undefined) {
        getUrl = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        getUrl = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        getUrl = window.webkitURL.createObjectURL(file);
      }
      return getUrl;
    }
    // //摄像
    // getVideo() {
    //   let self = this;
    //   var cmr = plus.camera.getCamera();
    //   var res = cmr.supportedVideoResolutions[0];
    //   var fmt = cmr.supportedVideoFormats[0];
    //   cmr.startVideoCapture(
    //     function(path) {
    //       plus.io.resolveLocalFileSystemURL(
    //         path,
    //         function(entry) {
    //           console.log(entry.toLocalURL() + " name=" + entry.name);
    //           self.videoList.push(entry.toLocalURL());
    //         },
    //         function(e) {
    //           console.log("读取拍照文件错误" + e.message);
    //           plus.nativeUI.toast("读取拍照文件错误：" + e.message);
    //         }
    //       );
    //     },
    //     function(error) {
    //       console.log("拍摄失败" + error.message);
    //     },
    //     { resolution: res, format: fmt }
    //   );
    // },
    // //从相册选
    // galleryVideo() {
    //   let self = this;
    //   plus.gallery.pick(
    //     function(event) {
    //       console.log("选择视频成功");
    //       for (var i in event.files) {
    //         console.log(event.files[i]);
    //         self.videoList.push(event.files[i]);
    //       }
    //     },
    //     function(error) {
    //       console.log("选择视频失败" + error.message);
    //     },
    //     {
    //       filter: "video",
    //       multiple: true,
    //       system: true
    //     }
    //   );
    // },
    // showActionSheet() {
    //   let self = this;
    //   let bts = [
    //     {
    //       title: "摄像"
    //     },
    //     {
    //       title: "从相册选择"
    //     }
    //   ];
    //   plus.nativeUI.actionSheet(
    //     {
    //       cancel: "取消",
    //       buttons: bts
    //     },
    //     function(e) {
    //       if (e.index == 1) {
    //         self.getVideo();
    //       } else if (e.index == 2) {
    //         self.galleryVideo();
    //       }
    //     }
    //   );
    // },
  },
  computed: {
    showVideo() {
      return this.videoList.length > 0;
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
        padding-bottom: .2rem
        .video-Tip
            font-size: .28rem
            color: $font-color
            display: block
            text-align: left
        .upload_warp
            overflow: hidden
            .upload_warp_img
                float: left
                .upload_warp_img_div
                    display: inline-block
                    position: relative
                    width: 1.44rem
                    height: 1.44rem
                    .upload_warp_img_div_del
                        position: absolute
                        left: 1.04rem
                        width: .4rem
                        height: .4rem
                        z-index: 2
                    .upload_warp_img_div_img
                        position: absolute
                        top: .2rem
                        width: 1.24rem
                        height: 1.24rem
                        background-color #000
            .videos
                .video
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem

</style>
