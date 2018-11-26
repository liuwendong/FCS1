<template>
    <div class="search">
        <div class="idNo">
            <div class="idNo-label">
                身份证号码:
            </div>
            <div class="idNo-input border-bottom">
                <input
                        class="input"
                        type="text"
                        placeholder="请输入身份证号码"
                        v-model="searchId"
                />
            </div>
        </div>
        <div class="search-btn" @click="searchClick">
            查询
        </div>
        <div class="margin"></div>
        <div class="tip">
            <div class="point"></div>
            <div class="tip-title">
                禁止性要求：禁止泄露客户隐私
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      searchId: ""
    };
  },
  methods: {
    searchClick() {
      this.$emit("search", this.searchId);
    }
  },
  mounted() {
    this.searchId = localStorage.idNo;
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .search
        margin-top: .4rem
        background: #ffffff
        width: 90%
        margin-left: 5%
        border-radius: .05rem
        .idNo
            height: 1.7rem
            display: flex
            background: #ffffff
            .idNo-label
                float: left
                height: 0.75rem
                margin-top: 0.74rem
                width: 1.86rem
                font-size: .28rem
                margin-left: .64rem
            .idNo-input
                height: 0.75rem
                width: 50%
                margin-top: 0.3rem
                .input
                    margin-top: 0.3rem
        .search-btn
            line-height: 0.64rem
            background: $mainColor
            width: 80%
            margin-left: 10%
            color: #ffffff
            font-size: 0.28rem
            border-radius: 0.04rem
        .margin
            margin-top: 0.4rem
            height: 0.2rem
            background: $bgColor
        .tip
            height: 0.88rem
            background: #fff1DD
            display: flex
            .point
                height: .2rem
                width: .2rem
                border-radius: .1rem
                background: $mainColor
                float: left
                margin-left: .34rem
                margin-top: .34rem
            .tip-title
                flex: 1
                color: #444444
                font-size: .28rem
                line-height: 0.88rem
                text-align: left
                margin-left: .2rem
                font-family: "PingFang SC"
</style>
