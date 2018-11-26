<template>
    <div class="addRmas">
        <add-nav
                @goBackToDetail="goBackToDetail"
        ></add-nav>
        <div class="content" ref="content">
            <div>
                <add-info
                        :clickSubmit="clickSubmit"
                        @showDialog="showDialog"
                        @infoOK="infoOK"
                ></add-info>
                <add-photo
                        :beginUp="infoIsOK"
                        :caseSubId="oneCase.caseSubId"
                        @photoUpFinish="photoUpFinish"
                        @photoUpErr="photoUpErr"
                ></add-photo>
                <add-video
                        :beginUp="photoUpIsOver"
                        :caseSubId="oneCase.caseSubId"
                        @videoUpFinish="videoUpFinish"
                        @videoUpErr="videoUpErr"
                ></add-video>
                <add-audio
                        :beginUp="videoUpIsOver"
                        :caseSubId="oneCase.caseSubId"
                        @audioUpFinish="audioUpFinish"
                        @audioUpErr="audioUpErr"
                ></add-audio>
                <div class="submitBtn" @click="submitClick">提交记录</div>
            </div>
        </div>
        <dialog-bar
                :show="isShowDialog"
                :content="DialogContent"
                @cancel="cancel"
        ></dialog-bar>
        <loading :isShowLoading="clickSubmit"></loading>
    </div>
</template>

<script>
import AddNav from "./component/AddNav";
import AddInfo from "./component/AddInfo";
import AddPhoto from "./component/AddPhoto";
import AddVideo from "./component/AddVideo";
import AddAudio from "./component/AddAudio";
import DialogBar from "../comment/DialogBar";
import Loading from "../comment/Loading";
import Bscroll from "better-scroll";
import { Decrypt, Encrypt } from "../../utils";
export default {
  name: "AddRmas",
  data() {
    return {
      clickSubmit: false,
      infoIsOK: false,
      photoUpIsOver: false,
      videoUpIsOver: false,
      audioUpIsOver: false,
      info: {},
      photoUrls: [],
      videoUrls: [],
      audioUrls: [],
      oneCase: {},
      myAddress: "定位失败",
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false
    };
  },
  components: {
    AddNav,
    AddInfo,
    AddPhoto,
    AddVideo,
    AddAudio,
    DialogBar,
    Loading
  },
  methods: {
    goBackToDetail() {
      this.$router.back(-1);
    },
    submitClick() {
      this.clickSubmit = true;
    },
    cancel() {
      this.clickSubmit = false;
      this.isShowDialog = false;
      if (this.goToLogin) {
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    },
    showDialog(content) {
      this.DialogContent = content;
      this.isShowDialog = true;
    },
    infoOK(info) {
      console.log("内容全部填写", info);
      this.info = info;
      this.infoIsOK = true;
    },
    photoUpFinish(imgUrls) {
      console.log("图片上传完成" + imgUrls);
      this.photoUpIsOver = true;
      this.photoUrls = imgUrls;
    },
    photoUpErr() {
      this.clickSubmit = false;
      this.DialogContent = "图片上传失败";
      this.isShowDialog = true;
    },
    videoUpFinish(videoUrls) {
      console.log("视频上传完成" + videoUrls);
      this.videoUpIsOver = true;
      this.videoUrls = videoUrls;
    },
    videoUpErr() {
      this.clickSubmit = false;
      this.DialogContent = "视频上传失败";
      this.isShowDialog = true;
    },
    audioUpFinish(audioUrls) {
      console.log("音频上传完成" + audioUrls);
      this.audioUpIsOver = true;
      this.audioUrls = audioUrls;
      this.submit();
    },
    audioUpErr() {
      this.clickSubmit = false;
      this.DialogContent = "音频上传失败";
      this.isShowDialog = true;
    },
    submit() {
      //上传催记
      this.goToLogin = false;
      let self = this;
      var photoList = "";
      for (let i = 0; i < this.photoUrls.length; i++) {
        if (i == 0) {
          photoList = photoList + this.photoUrls[i];
        } else {
          photoList = photoList + "," + this.photoUrls[i];
        }
      }

      var videoList = "";
      for (let i = 0; i < this.videoUrls.length; i++) {
        if (i == 0) {
          videoList = videoList + this.videoUrls[i];
        } else {
          videoList = videoList + "," + this.videoUrls[i];
        }
      }

      var audioList = "";
      for (let i = 0; i < this.audioUrls.length; i++) {
        if (i == 0) {
          audioList = audioList + this.audioUrls[i];
        } else {
          audioList = audioList + "," + this.audioUrls[i];
        }
      }

      self.info["photoList"] = photoList;
      self.info["videoList"] = videoList;
      self.info["audioList"] = audioList;
      self.info["caseSubId"] = self.oneCase.caseSubId;
      self.info["address"] = self.myAddress;
      let params = JSON.stringify(self.info);
      console.log("add info =" + params);
      let encrypt = Encrypt(params);

      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/collection/addCollection",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          console.log(response);
          self.clickSubmit = false;
          let data = response.data;
          let mydata = data.data;
          if (mydata == "Success") {
            self.$router.go(-1);
          } else if (mydata.code == "duplicateLogin") {
            self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
            self.isShowDialog = true;
            self.goToLogin = true;
          } else {
            self.clickSubmit = false;
            self.DialogContent = "提交失败，请重试";
            self.isShowDialog = true;
          }
        })
        .catch(function(error) {
          console.log(error);
          self.clickSubmit = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    }
  },
  mounted() {
    let self = this;
    this.oneCase = this.$route.params.mycase;
    console.log(this.oneCase);
    this.scroll = new Bscroll(this.$refs.content);
    //定位
    plus.geolocation.getCurrentPosition(
      function(position) {
        let lat = position.coords.latitude; //纬度
        let long = position.coords.longitude; //经度
        let country = position.address.country; //国家
        let province = position.address.province; //省
        let city = position.address.city; //市
        let district = position.address.district; //区
        let street = position.address.street; //街
        let streetNum = position.address.streetNum; //街道号
        self.myAddress =
          country + province + city + district + street + streetNum;
        if (self.myAddress.length == 0) {
          self.myAddress = "定位失败";
        }
      },
      function(error) {
        self.myAddress = "定位出错";
        console.log("定位出错：" + error.message);
      },
      {}
    );
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .addRmas
        background: #ffffff
        height: 100%
        width: 100%
        position: fixed
        .content
            overflow: hidden
            position: absolute
            top: .8rem
            left: 0
            bottom: 0
            right: 0
            .submitBtn
                margin-top: .62rem
                width: 70%
                margin-left: 15%
                line-height: .8rem
                color: #ffffff
                font-size: .3rem
                border-radius: .04rem
                background: $mainColor
</style>
