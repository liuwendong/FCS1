<template>
    <div class="hint" v-show="isShow">
        <div v-html="title" class="title"></div>
    </div>
</template>

<script>
export default {
  name: "Hint",
  props: {
    title: String,
    isShow: Boolean
  },
  data() {
    return {
      timer: null,
      inShowTime: 0
    };
  },
  methods: {
    timeAdd() {
      this.inShowTime = (this.inShowTime + 1) % 3;
      if (this.inShowTime == 0) {
        this.$emit("hideHint");
      }
    }
  },
  watch: {
    isShow: function(val) {
      if (val === true) {
        this.timer = setInterval(() => {
          this.timeAdd();
        }, 1000);
      } else {
        clearInterval(this.timer);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    .hint
        position: absolute
        top: 40%
        left: 2rem
        right: 2rem
        background: rgba(0,0,0,0.5)
        color: #ffffff
        font-size: .3rem
        border-radius: .05rem
        .title
            padding-top: .3rem
            padding-bottom: .3rem
</style>
