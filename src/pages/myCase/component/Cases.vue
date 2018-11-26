<template>
    <div>
        <Search
                v-show="!ishaveCases"
                @search="searchMyCase"
        ></Search>
        <div
                v-show="ishaveCases"
                ref="cases"
                class="cases"
        >
            <div>
                <div class="oneCase" v-for="(item,index) in cases" :key="index" @click="gotoDetail(index)">
                    <div class="oneline">
                        <div class="oneCase-key">借款人姓名：</div>
                        <div class="oneCase-value">{{item.name}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">电话号码：</div>
                        <div class="oneCase-value">{{item.phone}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">家庭地址：</div>
                        <div class="oneCase-value">{{item.homeAddr}}</div>
                    </div>
                    <div class="oneline">
                        <div class="oneCase-key">单位地址：</div>
                        <div class="oneCase-value">{{item.workAddr}}</div>
                    </div>
                        <div class="oneline">
                        <div class="oneCase-key">逾期总金额：</div>
                        <div class="oneCase-value money">{{item.overdueMoney + '元'}}</div>
                    </div>
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
</template>

<script>
import Search from "./Search";
import Bscroll from "better-scroll";
import DialogBar from "../../comment/DialogBar";
import Loading from "../../comment/Loading";
import { Decrypt, Encrypt } from "../../../utils";
export default {
  name: "Cases",
  data() {
    return {
      showLoading: false,
      pageSize: 10,
      pageIndex: 1,
      cases: [],
      isShowDialog: false,
      DialogContent: "",
      goToLogin: false
    };
  },
  props: {
    ishaveCases: Boolean
  },
  components: {
    Search,
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
    searchMyCase(idNo) {
      if (idNo == null || idNo.length == 0) {
        this.DialogContent = "请输入身份证号码";
        this.isShowDialog = true;
      } else {
        this.pageIndex = 1;
        this.cases = [];
        localStorage.idNo = idNo;
        this.requestData(idNo);
      }
    },
    // 请求数据
    requestData(idNo) {
      let self = this;
      let param = {
        idNo: "3412341966030360601",
        index: this.pageIndex,
        pageSize: this.pageSize
      };
      let params = JSON.stringify(param);
      let encrypt = Encrypt(params);
      self.showLoading = true;
      self
        .$axios({
          method: "POST",
          url: "/api/ace-app/caseInfo/rmasInfo/query",
          data: {
            params: encrypt,
            userId: localStorage.userId,
            token: localStorage.token
          }
        })
        .then(function(response) {
          console.log("请求我的案件 成功");
          self.loginSucc(response);
        })
        .catch(function(error) {
          console.log(error);
          self.showLoading = false;
          self.DialogContent = "系统繁忙，请稍等";
          self.isShowDialog = true;
        });
    },

    loginSucc(res) {
      //数据处理
      console.log(res);
      let self = this;
      let data = res.data;
      let mydata = data.data;
      if (mydata.code == "duplicateLogin") {
        self.DialogContent = "用户已在另一设备上登录，请在此设备上重新登录";
        self.isShowDialog = true;
        self.goToLogin = true;
        self.showLoading = false;
      } else {
        let list = mydata.list;
        if (this.pageIndex == 1) {
          self.cases = [];
          self.clearData();
        }
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            self.cases.push(list[i]);
          }
          //保存当前界面的状态
          self.saveData();
          //状态改变
          self.showLoading = false;
          self.$emit("getCases");
        } else {
          self.showLoading = false;
          self.DialogContent = "此身份证号暂无案件信息";
          self.isShowDialog = true;
        }
      }
    },

    gotoDetail(index) {
      this.$router.push({
        name: "caseDetail",
        params: { oneCase: this.cases[index], routerFrom: "Case" }
      });
    },
    saveData() {
      localStorage.cases = JSON.stringify(this.cases);
      localStorage.pageIndex = this.pageIndex;
    },
    clearData() {
      localStorage.removeItem("cases");
      localStorage.removeItem("pageIndex");
    }
  },
  watch: {
    ishaveCases: function(newVal) {
      let self = this;
      if (newVal === true) {
        this.$nextTick(() => {
          let bscrollDom = this.$refs.cases;
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
              self.pageIndex++;
              self.requestData(localStorage.idNo);
            }
            this.scroll.finishPullUp();
          });
          this.scroll.on("pullingDown", () => {
            if (!this.showLoading) {
              console.log("下拉刷新");
              self.pageIndex = 1;
              self.requestData(localStorage.idNo);
            }
            this.scroll.finishPullDown();
          });
        });
      } else {
        self.clearData();
      }
    }
  },
  mounted() {
    let mycases = localStorage.cases;
    if (mycases != null) {
      this.cases = JSON.parse(localStorage.cases);
      this.pageIndex = localStorage.pageIndex;
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .cases
        overflow: hidden
        position: absolute
        top: 1.9rem
        left: 0
        bottom: .15rem
        padding-bottom: .15rem
        right: 0
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
                    width : 1.86rem
                .oneCase-value
                    font-size: .28rem
                    color: $font-color
                    text-align: left
                    margin-right: .4rem
                    flex: 1
                .money
                    color: $mainColor
</style>
