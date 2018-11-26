<template>
    <div class="nav border-bottom">
        <img
                class="backIcon"
                src="~imgUrl/icon_back@2x.png"
                @click="goBack"
        />
        <label :class="navTitle">案件详情</label>
        <label
            class="add"
            v-show="isShow"
            @click="goToAddRmas"
        >新增记录</label>
    </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    isShow: Boolean
  },
  methods: {
    goBack() {
      this.$emit("goBackToCase");
    },
    goToAddRmas() {
      this.$emit('addRmas');
    }
  },
  computed: {
    navTitle: function() {
      return this.isShow ? "navTitle" : "navTitle1";
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .nav
        background: #ffffff
        width: 100%
        line-height: $headerHeight
        color: #333333
        font-size: .32rem
        display: flex
        .navTitle
            flex: 1
            padding-left: .92rem
        .navTitle1
            flex: 1
            padding-right: .72rem
        .backIcon
            width: .52rem
            height: .52rem
            float: left
            margin-left: .2rem
            margin-top: .15rem
        .add
            color: $mainColor
            font-size: .28rem
            width: 1.24rem
            height: .4rem
            margin-right: .4rem
            float: right
</style>
