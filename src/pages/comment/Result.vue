<template>
    <div class="result">
        <div class="nav border-bottom">
            <img
                class="backIcon"
                src="~imgUrl/icon_back@2x.png"
                @click="goBack"
            />
            <label class="navTitle">结果反馈</label>
        </div>
        <div class="content">
            <img class="noListImg" :src="getImgUrl"/>
            <div class="noListTip">
                <label v-text="getTip"></label>
            </div>
        </div>
    </div>
</template>

<script>
import success from "../../../static/state_success@2x.png";
import fail from "../../../static/icon_false@2x.png";
export default {
  name: "Result",
  data() {
    return {
      isSucc: this.$route.params.isSucc,
      fromRouter: this.$route.params.fromRouter
    };
  },
  computed: {
    getImgUrl: function() {
      return this.isSucc ? success : fail;
    },
    getTip: function() {
      return this.isSucc ? "提交成功" : "提交失败";
    }
  },
  methods: {
    goBack() {
      if (this.fromRouter == "applyFor") {
        //回到我的案件
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .result
        position: absolute
        top: 0
        right: 0
        bottom: 0
        left: 0
        background: #ffffff
        .nav
            background: #ffffff
            width: 100%
            line-height: $headerHeight
            color: #333333
            font-size: .32rem
            display: flex
            .navTitle
                flex: 1
                padding-right: .72rem
            .backIcon
                width: .52rem
                height: .52rem
                float: left
                margin-left: .2rem
                margin-top: .15rem
        .content
            width: 100%
            height: 3.04rem
            .noListImg
                margin-top: 1rem
                width: 1.76rem
                height: 1.76rem
                float: top
            .noListTip
                margin-top: .2rem
                color: #222222
                font-size: .34rem
</style>
