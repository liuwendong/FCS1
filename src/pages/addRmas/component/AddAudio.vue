<template>
    <div class="audioDiv border-bottom">
        <label class="photo-Tip">催收录音：</label>
        <div class="upload_warp">
            <div class="upload_warp_img" v-show="showAudio">
                <div class="upload_warp_img_div"
                     v-for="(item,index) in audioList"
                     :key="index"
                >
                    <img src="~imgUrl/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">
                    <audio
                            :src="item"
                            preload="auto"
                            controls="controls"
                            class="upload_warp_img_div_img"
                    ></audio>
                </div>
            </div>
            <div class="audios">
                <img class="audio" src="~imgUrl/add@2x.png" @click.stop="fileClick()"/>
                <input
                        type="file"
                        multiple
                        ref="uploadImage"
                        @change="fileChange($event)"
                        accept="audio/*"
                        name="file"
                        style="display: none"
                        id="upload_file_audio"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "AddAudio",
  data() {
    return {
      audioList: [],
      audioFile: [],
      audioUrls: [],
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
        if (this.audioFile.length > 0) {
          var succNum = 0;
          console.log("开始上传录音");
          for (let i = 0; i < this.audioFile.length; i++) {
            if (self.upErr) break;
            let file = this.audioFile[i];
            let param = new FormData();
            param.append("file", file, file.name);
            let config = { headers: { "Content-Type": "multipart/form-data" } };
            let url =
              "api/ace-app/collectionAudio/audioAdd?caseSubId=" +
              self.caseSubId;
            this.$axios
              .post(url, param, config)
              .then(response => {
                console.log(response);
                let mydata = response.data;
                if (mydata.message == "上传成功") {
                  succNum++;
                  //保存返回的URL
                  let url = mydata.data;
                  self.audioUrls.push(url);
                  if (succNum == this.audioFile.length) {
                    //音频上传完
                    self.$emit("audioUpFinish", self.audioUrls);
                  }
                } else {
                  self.upErr = true;
                  self.$emit("audioUpErr");
                }
              })
              .catch(error => {
                self.upErr = true;
                console.log(error);
                self.$emit("audioUpErr");
              });
          }
        } else {
          self.$emit("audioUpFinish", self.audioUrls);
        }
      }
    }
  },
  methods: {
    fileClick() {
      let imgSel = document.getElementById("upload_file_audio");
      console.log(imgSel);
      const event = new MouseEvent("click");
      imgSel.dispatchEvent(event);
    },
    fileChange(el) {
      let self = this;
      let file = el.target.files[0];
      console.log(file);
      var url = self.getFileURL(file);
      self.audioList.push(url);
      self.audioFile.push(file);
    },
    getFileURL(file) {
      console.log("getFileURL");
      var getUrl = null;
      if (window.createObjectURL != undefined) {
        getUrl = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        getUrl = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        getUrl = window.webkitURL.createObjectURL(file);
      }
      return getUrl;
    },
    // //录音
    // getAudio() {
    //   var rec = plus.audio.getRecorder();
    //   console.log("获取到的路由设备" + rec);
    //   rec.record(
    //     {},
    //     function(path) {
    //       console.log("录音成功");
    //       plus.io.resolveLocalFileSystemURL(
    //         path,
    //         function(entry) {
    //           console.log(entry.toLocalURL() + " name=" + entry.name);
    //           self.audioList.push(entry.toLocalURL());
    //         },
    //         function(e) {
    //           console.log("读取拍照文件错误" + e.message);
    //           plus.nativeUI.toast("读取拍照文件错误：" + e.message);
    //         }
    //       );
    //     },
    //     function(error) {
    //       console.log("录音失败");
    //     }
    //   );
    // },
    // galleryAuido() {
    //   let self = this;
    //   plus.gallery.pick(
    //     function(event) {
    //       console.log("选择音频成功");
    //       for (var i in event.files) {
    //         console.log(event.files[i]);
    //         self.audioList.push(event.files[i]);
    //       }
    //     },
    //     function(error) {
    //       console.log("选择音频失败" + error.message);
    //     },
    //     {
    //       filter: "video",
    //       multiple: true,
    //       system: true
    //     }
    //   );
    // },
    // showActionSheet() {
    //   let osName = plus.os.name;
    //   if (osName === "iOS") {
    //     this.showActionSheet_IOS();
    //   } else {
    //     this.showActionSheet_Android();
    //   }
    // },
    // showActionSheet_IOS() {
    //   let self = this;
    //   let bts = [
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
    //         self.galleryAuido();
    //       }
    //     }
    //   );
    // },
    // showActionSheet_Android() {
    //   let self = this;
    //   let bts = [
    //     {
    //       title: "录音"
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
    //         self.getAudio();
    //       } else if (e.index == 2) {
    //         self.galleryAuido();
    //       }
    //     }
    //   );
    // },
    fileDel(index) {
      let self = this;
      self.audioList.splice(index, 1);
    }
  },
  computed: {
    showAudio() {
      return this.audioList.length > 0;
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
        padding-bottom: .2rem
        .audio-Tip
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
            .audios
                .audio
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem
</style>
