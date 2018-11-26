<template>
    <div>
        <div class="oneCase">
            <div class="oneline">
                <div class="oneCase-key">代扣申请时间：</div>
                <div class="oneCase-value">2018年10月10日</div>
            </div>
            <div class="oneline">
                <div class="oneCase-key">代扣金额：</div>
                <div class="oneCase-value">{{money + '元'}}</div>
            </div>
            <div class="oneline">
                <div class="oneCase-key">扣款是否成功：</div>
                <div class="oneCase-value isScuccess">扣款成功</div>
            </div>
            <div class="oneline">
                <div class="oneCase-key">扣款银行卡：</div>
                <div class="oneCase-value">3895743957934593458</div>
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
</template>

<script>
import DialogBar from "../../comment/DialogBar";
import Loading from "../../comment/Loading";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "payInfo",
  data() {
    return {
      showLoading: false,
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false
    };
  },
  props: {
    caseSubId: String,
    money: String
  },
  components: {
    DialogBar,
    Loading
  },
  methods: {
    cancel() {
      this.isShowDialog = false;
      if (this.goToLogin) {
        let len = history.length;
        this.$router.go(-(len - 1));
      }
    },
    requestData() {
      let self = this;
      self.showLoading = true;
      let param = {
        caseSubId: self.caseSubId
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      this.$axios({
        method: "POST",
        url: "/api/ace-app/payState/rmasInfo/query",
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
          }
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    }
  },
  mounted() {
    this.requestData();
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .oneCase
        width: 90%
        background: #ffffff
        margin-left: 5%
        margin-top: .3rem
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
            .isScuccess
                color: $mainColor

</style>
