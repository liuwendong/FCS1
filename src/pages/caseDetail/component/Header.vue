<template>
    <div class="header">
        <div :class="myCaseClass">
            <div class="myCase-title" @click="isSelectedRmas(true)">
                催收记录
            </div>
            <div class="myCase-line"></div>
        </div>
        <div :class="myApplyClass" @click="isSelectedRmas(false)">
            <div class="myApply-title">
                申请代扣
            </div>
            <div class="myApply-line"></div>
        </div>

    </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      myCaseClass: "myCase",
      myApplyClass: "myApply1"
    };
  },
  methods: {
    isSelectedRmas(selected) {
      this.$emit("selectRmas", selected);
      if (selected) {
        this.myCaseClass = "myCase";
        this.myApplyClass = "myApply1";
      } else {
        this.myCaseClass = "myCase1";
        this.myApplyClass = "myApply";
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .header
        width: 100%
        height: $headerHeight
        .myCase
            background: #ffffff
            float: left
            width: 50%
            .myCase-title
                line-height: .76rem
                font-size: .3rem
                color: $mainColor
            .myCase-line
                width: 34%
                height: .04rem
                background: $mainColor
                border-radius: .02rem
                margin-left: 33%
        .myCase1
            background: #ffffff
            float: left
            width: 50%
            .myCase-title
                line-height: .76rem
                font-size: .3rem
            .myCase-line
                width: 34%
                height: .04rem
                border-radius: .02rem
                margin-left: 33%
        .myApply
            background: #ffffff
            float: right
            width: 50%
            .myApply-title
                line-height: .76rem
                font-size: .3rem
                color: $mainColor
            .myApply-line
                width: 34%
                height: .04rem
                background: $mainColor
                border-radius: .02rem
                margin-left: 33%
        .myApply1
            background: #ffffff
            float: right
            width: 50%
            .myApply-title
                line-height: .76rem
                font-size: .3rem
                color: $font-color
            .myApply-line
                width: 34%
                height: .04rem
                background: #ffffff
                border-radius: .02rem
                margin-left: 33%
</style>
