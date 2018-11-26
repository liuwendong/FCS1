<template>
    <div class="dialog" v-show="show">
        <div class="alert">
            <div class="title">{{title}}</div>
            <div class="content border-bottom">{{content}}</div>
            <div class="foot">
                <div v-if="type === 'inform'">
                    <button class="btn-base" @click="cancel">我知道了</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "dialogBar",
  props: {
    title: {
      type: String,
      default: "温馨提示"
    },
    content: {
      type: String,
      default: "请输入XXXXXX"
    },
    type: {
      type: String,
      default: "inform",
      validator(value) {
        return value === "confirm" || value === "inform";
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .dialog
        position: absolute
        top: 0
        right: 0
        bottom: 0
        left: 0
        background: transparent
        background-color: rgba(0,0,0,0.2)
        .alert
            width: 80%
            margin-left: 10%
            margin-top: 30%
            border-radius: .08rem
            background: #ffffff
            .title
                width: 100%
                font-size: .32rem
                line-height: .88rem
            .content
                font-size:.28rem
                padding-top: .8rem
                padding-bottom: .8rem
                padding-left: .3rem
                padding-right: .3rem
                text-align: center
            .foot
                width: 100%
                height: 1rem
                .btn-base
                    line-height: 1rem
                    width: 80%
                    color: $mainColor
                    font-size: .32rem
                    background: #ffffff
</style>
