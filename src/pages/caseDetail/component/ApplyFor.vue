<template>
    <div>
        <div class="info">
            <div class="oneline">
                <div class="oneCase-key">逾期金额：</div>
                <div class="oneCase-value">{{mycase.overdueMoney}}</div>
            </div>
            <div class="oneline">
                <div class="oneCase-key">利息：</div>
                <div class="oneCase-value">{{mycase.interest}}</div>
            </div>
            <div class="oneline">
                <div class="oneCase-key">逾期罚款：</div>
                <div class="oneCase-value">{{mycase.penalty}}</div>
            </div>
            <div class="oneline">
                <div class="oneCase-key">违约金：</div>
                <div class="oneCase-value">{{mycase.damages}}</div>
            </div>
        </div>
        <div class="money">
            <div class="idNo">
                <div class="idNo-label">
                    申请代扣金额:
                </div>
                <div class="idNo-input border-bottom">
                    <input v-model="money" class="input" type="number" placeholder="请输入申请代扣金额"/>
                </div>
            </div>
            <div class="search-btn" @click="searchClick">
                提交申请
            </div>
        </div>
        <dialog-bar :show="isShowDialog" :content="DialogContent" @cancel="cancel"></dialog-bar>
        <!--加载中-->
        <loading :isShowLoading="showLoading"></loading>
    </div>
</template>

<script>
import Hint from "../../comment/Hint";
import DialogBar from "../../comment/DialogBar";
import Loading from "../../comment/Loading";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "ApplyFor",
  data() {
    return {
      money: "",
      isShowDialog: false,
      DialogContent: "",
      showLoading: false,
      goToLogin: false
    };
  },
  components: {
    Hint,
    Loading,
    DialogBar
  },
  props: {
    mycase: Object
  },
  methods: {
    searchClick() {
      let self = this;
      if (
        self.money.length == 0 ||
        parseInt(self.money) >
          parseInt(self.mycase.overdueMoney) +
            parseInt(self.mycase.interest) +
            parseInt(self.mycase.penalty) +
            (self.mycase.damages == null ? 0 : parseInt(self.mycase.damages))
      ) {
        self.DialogContent = "请输入有效金额";
        self.isShowDialog = true;
      } else {
        self.showLoading = true;
        let param = {
          caseSubId: self.mycase.caseSubId,
          applyMoney: self.money,
          applyWay: "APP"
        };
        let params = JSON.stringify(param);
        let encrypt = Encrypt(params);
        self
          .$axios({
            method: "POST",
            url: "/api/ace-app/holdApply/rmasApplyCheck",
            data: {
              params: encrypt,
              userId: localStorage.userId,
              token: localStorage.token
            }
          })
          .then(function(response) {
            self.showLoading = false;
            console.log(response);
            let data = response.data;
            let message = data.data;
            if (message == "success") {
              self.passClick();
            } else if (message.code == "duplicateLogin") {
              self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
              self.isShowDialog = true;
              self.goToLogin = true;
            } else if (message == "apply") {
              self.DialogContent = "已提交过代扣申请，请等待上次申请的审核结果";
              self.isShowDialog = true;
            }
          })
          .catch(function(error) {
            console.log(error);
            self.DialogContent = "系统繁忙，请稍等";
            self.isShowDialog = true;
            self.unPassClick();
          });
      }
    },
    passClick() {
      this.$router.push({
        name: "result",
        params: { isSucc: true, fromRouter: "applyFor" }
      });
    },
    unPassClick() {
      this.$router.push({
        name: "result",
        params: { isSucc: false, fromRouter: "applyFor" }
      });
    },
    cancel() {
      this.isShowDialog = false;
      if (this.goToLogin) {
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/varibles.styl"
    .info
        width: 90%
        margin-left: 5%
        height: 2.6rem
        background: #ffffff
        border-radius: .08rem
        margin-top: .3rem
        .oneline
            display: flex
            padding-top: .25rem
            padding-bottom: .05rem
            .oneCase-key
                float: left
                margin-left: .4rem
                font-size: .28rem
                color: $font-color
                text-align: left
                width : 1.86rem
            .oneCase-value
                font-size: .28rem
                color: $font-color
                text-align: left
                flex: 1
    .money
        width: 90%
        margin-left: 5%
        height: 2.76rem
        background: #ffffff
        border-radius: .08rem
        margin-top: .2rem
        .idNo
            height: 1.7rem
            display: flex
            background: #ffffff
            .idNo-label
                float: left
                height: 0.75rem
                margin-top: 0.74rem
                width: 1.86rem
                font-size: .28rem
                margin-left: .64rem
            .idNo-input
                height: 0.75rem
                width: 50%
                margin-top: 0.3rem
                .input
                    margin-top: 0.3rem
        .search-btn
            line-height: 0.64rem
            background: $mainColor
            width: 80%
            margin-left: 10%
            color: #ffffff
            font-size: 0.28rem
            border-radius: 0.04rem
</style>
