<template>
    <div class="checkWaiting" v-show="isShow" ref="checkWaiting">
        <div>
            <div class="noList" v-show="!isHaveList">
                <img class="noListImg" src="~imgUrl/noList@2x.png"/>
                <div class="noListTip">
                    <label>暂无待审核案件</label>
                </div>
            </div>
            <div>
                <div class="oneCase" v-for="(item,index) in checks" :key="index">
                    <div class="oneline">
                        <div class="oneCase-key">客户姓名：</div>
                        <div class="oneCase-value">{{item.name}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">借据号：</div>
                        <div class="oneCase-value">{{item.caseSubId}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">代扣金额：</div>
                        <div class="oneCase-value">{{item.applyMoney + '元'}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">机构：</div>
                        <div class="oneCase-value">{{item.organization}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">代扣申请渠道：</div>
                        <div class="oneCase-value">{{item.applyWay}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">催收人员：</div>
                        <div class="oneCase-value">{{item.collectionName}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">申请时间：</div>
                        <div class="oneCase-value">{{getTime(item.applyTime)}}</div>
                    </div>
                    <div class="btns">
                        <button class="pass" @click="passClick(index)">
                            通过
                        </button>
                        <button class="unPass" @click="unPassClick(index)">
                            拒绝
                        </button>
                    </div>
                </div>
            </div>
            <!--提示语-->
            <dialog-bar
                    :show="isShowDialog"
                    :content="DialogContent"
                    @cancel="cancel"
            ></dialog-bar>
            <!--加载中-->
            <loading :isShowLoading="showLoading"></loading>
        </div>
    </div>
</template>

<script>
import Bscroll from "better-scroll";
import Loading from "../../comment/Loading";
import DialogBar from "../../comment/DialogBar";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "CheckWaiting",
  data() {
    return {
      index: 1,
      pageSize: 10,
      checks: [],
      isHaveList: false,
      showLoading: false,
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false
    };
  },
  props: {
    isShow: Boolean
  },
  components: {
    Loading,
    DialogBar
  },
  methods: {
    cancel() {
      this.isShowDialog = false;
      if (this.goToLogin) {
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    },
    passClick(index) {
      let self = this;
      self.showLoading = true;
      let param = {
        caseSubId: self.checks[index].caseSubId,
        isPass: "Y"
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/waitingCheck/rmasApplyCheck",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          console.log(response);
          self.showLoading = false;
          let data = response.data;
          let mydata = data.data;
          if (mydata.code == "duplicateLogin") {
            self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
            self.isShowDialog = true;
            self.goToLogin = true;
          } else if (mydata == "success") {
            self.$router.push({
              name: "result",
              params: { isSucc: true, fromRouter: "check" }
            });
          } else {
            self.$router.push({
              name: "result",
              params: { isSucc: false, fromRouter: "check" }
            });
          }
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    },
    unPassClick(index) {
      let self = this;
      self.showLoading = true;
      let param = {
        caseSubId: self.checks[index].caseSubId,
        isPass: "N"
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/waitingCheck/rmasApplyCheck",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          console.log(response);
          self.showLoading = false;
          let data = response.data;
          let mydata = data.data;
          if (mydata.code == "duplicateLogin") {
            self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
            self.isShowDialog = true;
            self.goToLogin = true;
          } else if (mydata == "success") {
            self.$router.push({
              name: "result",
              params: { isSucc: true, fromRouter: "check" }
            });
          } else {
            self.$router.push({
              name: "result",
              params: { isSucc: false, fromRouter: "check" }
            });
          }
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    },
    requestData() {
      console.log("请求待审核");
      let self = this;
      self.showLoading = true;
      let param = {
        index: this.index,
        pageSize: this.pageSize
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      console.log("token =" + localStorage.token);
      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/waitingCheck/rmasWaiting/query",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          console.log(response);
          self.showLoading = false;
          let data = response.data;
          let mydata = data.data;
          if (mydata.code == "duplicateLogin") {
            self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
            self.isShowDialog = true;
            self.goToLogin = true;
          } else {
            let list = mydata.list;
            if (list.length == 0 && self.index == 1) {
              self.isHaveList = false;
            } else {
              self.isHaveList = true;
              if (self.index == 1) {
                self.checks = [];
              }
              if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                  self.checks.push(list[i]);
                }
              }
            }
            localStorage.checkwaiting = JSON.stringify(self.checks);
          }
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    },
    getTime(time) {
      if (time != null) {
        return (
          time.substring(0, 4) +
          "年" +
          time.substring(4, 6) +
          "月" +
          time.substring(6, 8) +
          "日"
        );
      } else {
        return "";
      }
    }
  },
  watch: {
    isShow: function(newVal) {
      if (newVal === true) {
        let bscrollDom = this.$refs.checkWaiting;
        console.log(bscrollDom);
        this.scroll = new Bscroll(bscrollDom, {
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
        console.log("checkWaiting isShow true");
        this.requestData();
      }
    }
  },
  mounted() {
    let bscrollDom = this.$refs.checkWaiting;
    console.log(bscrollDom);
    this.scroll = new Bscroll(bscrollDom, {
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
    console.log("checkWaiting isShow true");
    this.requestData();
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .checkWaiting
        overflow: hidden
        position: absolute
        top: 1.9rem
        left: 0
        right: 0
        bottom: .15rem
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
        .oneCase
            margin-right: 5%
            background: #ffffff
            margin-left: 5%
            margin-bottom: .3rem
            border-radius: .08rem
            .oneline
                display: flex
                padding-top: .15rem
                padding-bottom: .15rem
                .oneCase-key
                    float: left
                    margin-left: .4rem
                    font-size: .28rem
                    color: $font-color
                    text-align: left
                    width : 2rem
                .oneCase-value
                    flex: 1
                    font-size: .28rem
                    color: $font-color
                    text-align: left
                    margin-right: .4rem
            .btns
                margin-top: .25rem
                margin-left: .4rem
                margin-right: .4rem
                padding-bottom: .25rem
                height: .64rem
                .pass
                    width: 40%
                    line-height: .64rem
                    color: #ffffff
                    background: $mainColor
                    border-radius: .04rem
                    font-size: .3rem
                    float: left
                .unPass
                    width: 40%
                    line-height: .64rem
                    color: $mainColor
                    background: #ffffff
                    border-radius: .04rem
                    border-color: $mainColor
                    border-width: .01rem
                    border-style: solid
                    font-size: .3rem
                    float: right
</style>
