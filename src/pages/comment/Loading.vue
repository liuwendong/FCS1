<template>
    <div class="bg" v-show="isShowLoading">
        <div class="loading">
            <img class="img" src="~imgUrl/loading.gif"/>
        </div>
    </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    isShowLoading: false
  }
};
</script>

<style lang="stylus" scoped>
    .bg
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: transparent
        background-color: rgba(0,0,0,0.2)
        .loading
            position: absolute
            top: 40%
            width: 1.2rem
            height: 1.2rem
            left: 50%
            margin-left: -.75rem
            background: rgba(0,0,0,0.5)
            color: #ffffff
            font-size: .3rem
            border-radius: .05rem
            .img
                margin-top: .1rem
                width: 1.0rem
                height: 1.0rem
</style>
