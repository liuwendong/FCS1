<template>
    <div class="nav border-bottom">
        <img
                class="backIcon"
                src="~imgUrl/icon_back@2x.png"
                @click="goBack"
        />
        <label class="navTitle1">新增催收记录</label>
    </div>
</template>

<script>
export default {
  name: "Nav",
  methods: {
    goBack() {
      this.$emit("goBackToDetail");
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
        .navTitle1
            flex: 1
            font-size: .32rem
            padding-right: .72rem
        .backIcon
            width: .52rem
            height: .52rem
            float: left
            margin-left: .2rem
            margin-top: .15rem
</style>
