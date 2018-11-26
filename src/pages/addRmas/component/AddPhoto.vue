<template>
    <div class="photoDiv border-bottom">
        <label class="photo-Tip">催收图片：</label>
        <div class="upload_warp">
            <div class="upload_warp_img" v-show="showImg">
                <div class="upload_warp_img_div"
                     v-for="(item,index) in imgList"
                     :key="index"
                >
                    <img src="~imgUrl/del.png" class="upload_warp_img_div_del" @click="fileDel(index)">
                    <img
                            preview="1"
                            :src=item
                            class="upload_warp_img_div_img"
                    />
                </div>
            </div>
            <div class="photos">
                <img class="photo" src="~imgUrl/add@2x.png" @click.stop="fileClick()" />
                <input
                        type="file"
                        multiple
                        ref="uploadImage"
                        @change="fileChange($event)"
                        accept="image/*"
                        name="file"
                        style="display: none"
                        id="upload_file_photo"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "addPhoto",
  data() {
    return {
      imgList: [],
      imgFiles: [],
      imgUrls: [],
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
        //开始上传图片
        let self = this;
        self.upErr = false;
        if (this.imgFiles.length > 0) {
          console.log("开始上传图片");
          var succNum = 0;
          for (let i = 0; i < self.imgFiles.length; i++) {
            if (self.upErr) break;
            let file = self.imgFiles[i];
            let param = new FormData();
            param.append("file", file, file.name);
            let config = { headers: { "Content-Type": "multipart/form-data" } };
            let url =
              "api/ace-app/collectionPhoto/imageAdd?caseSubId=" +
              self.caseSubId;
            self.$axios
              .post(url, param, config)
              .then(response => {
                console.log(response);
                let mydata = response.data;
                if (mydata.message == "上传成功") {
                  succNum++;
                  //保存返回的URL
                  let url = mydata.data;
                  self.imgUrls.push(url);
                  if (succNum == this.imgFiles.length) {
                    //图片上传完
                    self.$emit("photoUpFinish", self.imgUrls);
                  }
                } else {
                  self.upErr = true;
                  self.$emit("photoUpErr");
                }
              })
              .catch(error => {
                console.log(error);
                self.upErr = true;
                self.$emit("photoUpErr");
              });
          }
        } else {
          self.$emit("photoUpFinish", self.imgUrls);
        }
      }
    }
  },
  methods: {
    fileClick() {
      let imgSel = document.getElementById("upload_file_photo");
      console.log(imgSel);
      const event = new MouseEvent("click");
      imgSel.dispatchEvent(event);
    },
    fileChange(el) {
      let self = this;
      for (let i = 0; i < el.target.files.length; i++) {
        let file = el.target.files[i];
        this.imgFiles.push(file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
          self.imgList.push(this.result);
        };
      }
    },
    fileDel(index) {
      let self = this;
      self.imgList.splice(index, 1);
      self.imgFiles.splice(index, 1);
    }

    //调用手机摄像头并拍照
    // getImage() {
    //   let self = this;
    //   let cmr = plus.camera.getCamera();
    //   cmr.captureImage(
    //     function(p) {
    //       plus.io.resolveLocalFileSystemURL(
    //         p,
    //         function(entry) {
    //           console.log(entry.toLocalURL() + " name=" + entry.name);
    //           self.imgList.push(entry.toLocalURL());
    //         },
    //         function(e) {
    //           console.log("读取拍照文件错误" + e.message);
    //           plus.nativeUI.toast("读取拍照文件错误：" + e.message);
    //         }
    //       );
    //     },
    //     function(e) {
    //       console.log("拍照失败" + e.message);
    //     },
    //     {
    //       filter: "image"
    //     }
    //   );
    // },
    // //从相册选择照片
    // galleryImgs() {
    //   let self = this;
    //   plus.gallery.pick(
    //     function(event) {
    //       console.log("选择照片成功");
    //       for (var i in event.files) {
    //         console.log(event.files[i]);
    //         self.imgList.push(event.files[i]);
    //       }
    //     },
    //     function(error) {
    //       console.log("选择图片失败" + error.message);
    //     },
    //     {
    //       filter: "image",
    //       multiple: true,
    //       system: true
    //     }
    //   );
    // },
    // //点击事件，弹出选择摄像头和相册的选项
    // showActionSheet() {
    //   let self = this;
    //   let bts = [
    //     {
    //       title: "拍照"
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
    //         self.getImage();
    //       } else if (e.index == 2) {
    //         self.galleryImgs();
    //       }
    //     }
    //   );
    // },
  },
  computed: {
    showImg() {
      return this.imgList.length > 0;
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
        padding-bottom: .2rem
        .photo-Tip
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
            .photos
                .photo
                    width: 1.24rem
                    height: 1.24rem
                    padding-top: .2rem
                    padding-right: .4rem
</style>
