<template>
    <div class="rmasList">
        <div class="noList" v-show="!isHaveList">
            <img class="noListImg" src="~imgUrl/noList@2x.png"/>
            <div class="noListTip">
                <label>暂无催收记录</label>
            </div>
        </div>
        <div class="haveList" v-show="isHaveList" ref="haveList">
            <div>
                <div class="oneList"
                     v-for="(item,index) in rmasDatas"
                     :key="index"
                >
                    <rmas-info
                            :item="item"
                    ></rmas-info>
                    <rmas-photo :item="item"
                                @downloading="downloading"
                                @downloaded="downloaded"
                                @downloadErr="downloadErr"
                                :preview="index"
                    ></rmas-photo>
                    <rmas-video :item="item"
                                @downloading="downloading"
                                @downloaded="downloaded"
                                @downloadErr="downloadErr"
                    ></rmas-video>
                    <rmas-audio :item="item"
                                @downloading="downloading"
                                @downloaded="downloaded"
                                @downloadErr="downloadErr"
                    ></rmas-audio>
                </div>
            </div>
        </div>
        <!--提示语-->
        <dialog-bar :show="isShowDialog" :content="DialogContent" @cancel="cancel"></dialog-bar>
        <!--加载中-->
        <loading :isShowLoading="showLoading"></loading>
    </div>
</template>

<script>
import RmasInfo from "./RmasInfo";
import RmasPhoto from "./RmasPhoto";
import RmasVideo from "./RmasVideo";
import RmasAudio from "./RmasAudio";
import Bscroll from "better-scroll";
import Loading from "../../comment/Loading";
import DialogBar from "../../comment/DialogBar";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "rmaslist",
  data() {
    return {
      showLoading: false,
      pageSize: 10,
      pageIndex: 1,
      rmasDatas: [],
      isHaveList: true,
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false
    };
  },
  props: {
    caseSubId: String
  },
  components: {
    RmasInfo,
    RmasPhoto,
    RmasVideo,
    RmasAudio,
    Loading,
    DialogBar
  },
  methods: {
    // 请求数据
    requestData() {
      console.log("请求催收记录" + this.caseSubId);
      let self = this;
      self.showLoading = true;
      let param = {
        caseSubId: self.caseSubId,
        index: self.pageIndex,
        pageSize: self.pageSize
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      this.$axios({
        method: "POST",
        url: "/api/ace-app/collection/rmasCollection/query",
        data: {
          params: encrypt,
          userId: localStorage.userId,
          token: localStorage.token
        }
      })
        .then(function(response) {
          console.log(response);
          self.showLoading = false;
          if (self.pageIndex == 1) {
            self.rmasDatas = [];
          }
          let mydata = response.data;
          let mylist = mydata.data;
          let list = mylist.list;
          if (mylist.code == "duplicateLogin") {
            self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
            self.isShowDialog = true;
            self.goToLogin = true;
          } else if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              let data = list[i];
              self.rmasDatas.push(data);
            }
            self.isHaveList = true;
          } else {
            self.isHaveList = self.rmasDatas.length > 0;
          }
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    },
    cancel() {
      this.isShowDialog = false;
      if (this.goToLogin) {
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    },
    downloading() {
      this.showLoading = true;
    },
    downloaded() {
      this.showLoading = false;
    },
    downloadErr(err) {
      this.showLoading = false;
      this.showLoading = false;
      this.DialogContent = err;
    }
  },
  mounted() {
    this.requestData();
    this.scroll = new Bscroll(this.$refs.haveList, {
      click: true,
      scrollY: true,
      pullUpLoad: {
        threshold: -30
      },
      pullDownRefresh: {
        threshold: 30,
        stop: 20
      }
    });
    this.scroll.on("pullingUp", () => {
      if (!this.showLoading) {
        console.log("上拉加载");
        this.pageIndex++;
        this.requestData();
      }
      this.scroll.finishPullUp();
    });
    this.scroll.on("pullingDown", () => {
      if (!this.showLoading) {
        console.log("下拉刷新");
        this.pageIndex = 1;
        this.requestData();
      }
      this.scroll.finishPullDown();
    });
  }
};
</script>

<style lang="stylus" scoped>
    .rmasList
        .noList
            width: 100%
            height: 3.04rem
            .noListImg
                margin-top: 1rem
                width: 2.44rem
                height: 2.44rem
                float: top
            .noListTip
                margin-top: .2rem
                color: #666666
                font-size: .28rem
        .haveList
            overflow: hidden
            position: absolute
            top: 1.9rem
            left: 5%
            right: 5%
            bottom: .15rem
            padding-bottom: .15rem
            border-radius: .08rem
            .oneList
                background: #ffffff
                padding-bottom: .3rem
                margin-bottom: .3rem
</style>
