<template>
    <div class="applys" ref="applys">
        <div>
            <div class="noList" v-show="!isHaveList">
                <img class="noListImg" src="~imgUrl/noList@2x.png"/>
                <div class="noListTip">
                    <label>暂无申请记录</label>
                </div>
            </div>
            <div class="oneApply" v-for="(item,index) in applys" :key="index">
                <div class="oneline">
                    <div class="oneCase-key">代扣申请时间：</div>
                    <div class="oneCase-value">{{getTime(item.applyTime)}}</div>
                </div>
                <div class="oneline">
                    <div class="oneCase-key">代扣金额：</div>
                    <div class="oneCase-value">{{item.applyMoney + '元'}}</div>
                </div>
                <div class="oneline">
                    <div class="oneCase-key">申请是否通过：</div>
                    <div class="oneCase-value">{{item.applyIsPass == 'N'?"未通过":"已通过"}}</div>
                </div>
                <div class="oneline">
                    <div class="oneCase-key">扣款是否成功：</div>
                    <div class="oneCase-value">{{item.paymentIsSucc == 'Y'?'已扣款':'未扣款'}}</div>
                </div>
                <div class="oneline">
                    <div class="oneCase-key">扣款银行卡：</div>
                    <div class="oneCase-value">{{item.paymentcardNo}}</div>
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
  name: "Applys",
  data() {
    return {
      showLoading: false,
      pageSize: 10,
      pageIndex: 1,
      applys: [],
      isHaveList: false,
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
        console.log("回到首页");
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    },
    requestData() {
      console.log("请求我的代扣申请");
      let self = this;
      let param = {
        index: self.pageIndex,
        pageSize: self.pageSize
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      self.showLoading = true;
      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/holdApply/rmasWaiting/query",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          self.loginSucc(response);
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    },
    loginSucc(response) {
      console.log("我的代扣申请 请求成功");
      console.log(response);
      //数据处理
      let self = this;
      let data = response.data;
      let mydata = data.data;
      console.log("mydata.code" + mydata.code);
      if (mydata.code == "duplicateLogin") {
        self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
        self.isShowDialog = true;
        self.goToLogin = true;
      } else {
        let list = mydata.list;
        if (this.pageIndex == 1) {
          this.applys = [];
          this.clearData();
        }
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            self.applys.push(list[i]);
          }
          //存数据
          self.saveData();
          self.isHaveList = true;
        } else if (this.pageIndex == 1) {
          self.isHaveList = false;
        }
      }
      //状态改变
      self.showLoading = false;
    },
    saveData() {
      localStorage.applys = JSON.stringify(this.applys);
      localStorage.applyIndex = this.pageIndex;
    },
    clearData() {
      localStorage.removeItem("applys");
      localStorage.removeItem("applyIndex");
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
        this.$nextTick(() => {
          let bscrollDom = this.$refs.applys;
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
              this.requestData(localStorage.idNo);
            }
            this.scroll.finishPullUp();
          });
          this.scroll.on("pullingDown", () => {
            if (!this.showLoading) {
              console.log("下拉刷新");
              this.pageIndex = 1;
              this.requestData(localStorage.idNo);
            }
            this.scroll.finishPullDown();
          });
        });
      }
      if (localStorage.applys == null) {
        this.requestData();
      } else {
        this.cases = JSON.parse(localStorage.applys);
        this.pageIndex = localStorage.applyIndex;
      }
    }
  },
  mounted() {
    this.clearData();
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .applys
        overflow: hidden
        position: absolute
        top: 1.9rem
        left: 0
        right: 0
        bottom: .15rem
        padding-bottom: .15rem
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
        .oneApply
            width: 90%
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
                    width : 2.2rem
                .oneCase-value
                    font-size: .28rem
                    color: $font-color
                    text-align: left
                    flex: 1
</style>
