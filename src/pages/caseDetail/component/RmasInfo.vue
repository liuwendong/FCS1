<template>
    <div class="rmasInfo">
        <div class="oneline">
            <div class="oneCase-key">催收时间：</div>
            <div class="oneCase-value">{{getTime(item.collectionTime)}}</div>
        </div>
        <div class="oneline">
            <div class="oneCase-key">催收员：</div>
            <div class="oneCase-value">{{item.collectionName}}</div>
        </div>
        <div class="oneline">
            <div class="oneCase-key">催收结果：</div>
            <div class="oneCase-value">{{item.collectionResult}}</div>
        </div>
        <div class="oneline">
            <div class="oneCase-key">面谈人姓名：</div>
            <div class="oneCase-value">{{item.interviewName}}</div>
        </div>
        <div class="oneline">
            <div class="oneCase-key">面谈人关系：</div>
            <div class="oneCase-value">{{item.interviewRelationship}}</div>
        </div>
    </div>
</template>

<script>
export default {
  name: "RmasInfo",
  props: {
    item: Object
  },
  methods: {
    getTime(time) {
      return time;
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .oneline
        display: flex
        padding-top: .25rem
        padding-bottom: .05rem
        .oneCase-key
            float: left
            padding-left: .4rem
            font-size: .28rem
            color: $font-color
            text-align: left
            width : 1.86rem
        .oneCase-value
            font-size: .28rem
            color: $font-color
            text-align: left
            flex: 1
</style>
