<template>
    <div class="checked" ref="checked"  v-show="isShow">
        <div>
            <div class="noList" v-show="!isHaveList">
                <img class="noListImg" src="~imgUrl/noList@2x.png"/>
                <div class="noListTip">
                    <label>暂无已审核案件</label>
                </div>
            </div>
            <div class="oneCase" v-for="(item,index) in checkeds" :key="index">
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
                <div class="oneline" v-if="item.paymentIsSucc === 'true'">
                    <div class="oneCase-key">扣款状态：</div>
                    <div class="oneCase-value pay">扣款成功</div>
                </div>
                <div class="btn" v-else>
                    <button class="check" @click="checkClick(index)">查看扣款状态</button>
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
  name: "Checked",
  data() {
    return {
      index: 1,
      pageSize: 10,
      isHaveList: false,
      checkeds: [],
      showLoading: false,
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false
    };
  },
  components: {
    Loading,
    DialogBar
  },
  props: {
    isShow: Boolean
  },
  methods: {
    cancel() {
      this.isShowDialog = false;
      if (this.goToLogin) {
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    },
    checkClick(index) {
      console.log("go to payStatus");
      this.$router.push({ name: "payStatus", params: this.checkeds[index] });
    },
    requestData() {
      console.log("请求已审核");
      let self = this;
      self.showLoading = true;
      let param = {
        index: this.index,
        pageSize: this.pageSize
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/waitingCheck/rmasChecked/query",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          console.log(response);
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
                self.checkeds = [];
              }
              if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                  self.checkeds.push(list[i]);
                }
              }
            }
          }
          self.showLoading = false;
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
        this.$nextTick(() => {
          let bscrollDom = this.$refs.checked;
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
        });
        this.requestData();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .checked
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
                    width : 2rem
                .oneCase-value
                    font-size: .28rem
                    color: $font-color
                    text-align: left
                    flex: 1
                .pay
                    color: $mainColor
            .btn
                margin-top: .25rem
                margin-left: .4rem
                margin-right: .4rem
                padding-bottom: .25rem
                height: .64rem
                .check
                    width: 80%
                    margin-left: 10%
                    line-height: .64rem
                    color: #ffffff
                    background: $mainColor
                    border-radius: .04rem
                    font-size: .3rem
                    float: left
</style>
