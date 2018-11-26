<template>
    <div class="content">
        <div class="logo">
        <img src="~imgUrl/FCSLogo.jpg"/>
        </div>
        <div class="tip">催收APP</div>
        <div class="loginInput">
            <div class="name border-bottom">
                <img class="nameSpan" src="~imgUrl/userName@2x.png" />
                <input class="nameInput" type="text" placeholder="请输入用户名" v-model="name"/>
            </div>
            <div class="pwd border-bottom">
                <img class="pwdSpan" src="~imgUrl/pwd@2x.png"/>
                <input
                        class="pwdInput"
                        type="text"
                        v-show="isOpen"
                        v-model="pwd"
                        placeholder="请输入密码"
                />
                <input
                        class="pwdInput-pwd"
                        type="password"
                        v-show="!isOpen"
                        v-model="pwd"
                        placeholder="请输入密码"
                />
                <img id="eyeId" class="eye" @click="openCloseClick" :src="eyeImgUrl"/>
            </div>
        </div>
        <button
                class="loginBtn"
                @click="loginBtnClick"
        >登录</button>
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
import eyeOpen from "../../../../static/eyeOpen@2x.png";
import eyeClose from "../../../../static/eyeClose@2x.png";
import DialogBar from "../../comment/DialogBar";
import Loading from "../../comment/Loading";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "LoginContent",
  data() {
    return {
      isOpen: false,
      pwd: "",
      name: "",
      eyeImgUrl: eyeClose,
      showLoading: false,
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false,
      testUrl: "",
      videoUrl: ""
    };
  },
  components: {
    DialogBar,
    Loading
  },
  methods: {
    cancel() {
      this.isShowDialog = false;
    },
    openCloseClick() {
      if (this.isOpen) {
        this.eyeImgUrl = eyeClose;
        this.isOpen = !this.isOpen;
      } else {
        this.eyeImgUrl = eyeOpen;
        this.isOpen = !this.isOpen;
      }
    },
    loginBtnClick() {
      let self = this;
      if (this.name.length == 0) {
        this.DialogContent = "请输入用户名";
        this.isShowDialog = true;
      } else if (this.pwd.length == 0) {
        this.DialogContent = "请输入密码";
        this.isShowDialog = true;
      } else {
        localStorage.clear();
        self.showLoading = true;
        let param = { userId: self.name, pwd: self.pwd };
        let params = JSON.stringify(param);
        let encrypt = Encrypt(params);
        this.$axios({
          method: "POST",
          url: "/api/ace-app/login/",
          data: {
            params: encrypt,
            token: ""
          }
        })
          .then(function(response) {
            console.log(response);
            self.showLoading = false;
            let mydata = response.data;
            let data = mydata.data;
            let limited = data.limitedTeam;
            let token = data.token;
            localStorage.token = token;
            localStorage.userId = self.name;
            console.log(token); //duplicateLogin
            if (limited.limitedTeam == "notexist") {
              self.DialogContent = "用户名不存在或者密码错误";
              self.isShowDialog = true;
            } else if (limited.limitedTeam == "manager") {
              self.$router.push("/myCase");
            } else if (limited.limitedTeam == "oaTeam") {
              self.$router.push("/myCase");
            } else if (limited.limitedTeam == "repayTeam") {
              self.$router.push("/check");
            }
          })
          .catch(function(error) {
            console.log(error);
            self.showLoading = false;
            self.DialogContent = "系统繁忙，请稍等";
            self.isShowDialog = true;
          });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .content
        width: 100%
        height: 100%
        .logo
            margin-top: 2rem
        .tip
            margin-top: 0.2rem
            font-size: 0.4rem
            color: $font-color
            font-family: "PingFang SC"
        .loginInput
            width: 80%
            margin-top: 0.84rem
            margin-left: 10%
            line-height: 0.8rem
            .name
                display: flex
                .nameSpan
                    width: .6rem
                    height: .6rem
                    float: left
                .nameInput
                    flex: 1
                    margin-left: 0.1rem
            .pwd
                display: flex
                .pwdSpan
                    width: .6rem
                    height: .6rem
                    margin-top: .1rem
                    float: left
                .pwdInput
                    flex: 1
                    margin-left: 0.1rem
                .pwdInput-pwd
                    flex: 1
                    margin-left: 0.1rem
                .eye
                    width: .6rem
                    height: .6rem
                    float: right
        .loginBtn
            margin-top: 0.6rem
            width: 80%
            line-height: 0.8rem
            height: 0.8rem
            background: $commitBtnColor
            border-radius: 0.04rem
            color: #ffffff
            font-size: 0.3rem
</style>
