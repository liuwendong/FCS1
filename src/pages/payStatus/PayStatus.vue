<template>
    <div class="payStatus">
        <pay-nav></pay-nav>
        <pay-info
                :caseSubId="oneCase.caseSubId"
                :money="oneCase.applyMoney"
        ></pay-info>
    </div>
</template>

<script>
import PayNav from "./component/PayNav";
import PayInfo from "./component/PayInfo";
export default {
  name: "PayStatus",
  data() {
    return {
      oneCase: this.$route.params
    };
  },
  components: {
    PayNav,
    PayInfo
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .payStatus
        background: $bgColor
        height: 100%
        width: 100%
        position: fixed
</style>
