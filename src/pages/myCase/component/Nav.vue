<template>
    <div class="nav border-bottom">
        <img
                class="backIcon"
                src="~imgUrl/icon_back@2x.png"
                @click="goBack"
                v-show="isShow"
        />
        <label :class="navTitle">我的案件</label>
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
      this.$emit("myGoBack");
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
            padding-right: .72rem
        .navTitle1
            flex: 1
        .backIcon
            width: .52rem
            height: .52rem
            float: left
            margin-left: .2rem
            margin-top: .15rem
</style>
