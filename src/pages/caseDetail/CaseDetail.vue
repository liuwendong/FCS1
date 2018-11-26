<template>
    <div class="myCaseDetail">
        <Nav
                @goBackToCase="goBackToCase"
                @addRmas="addRmas"
                :isShow="isSelectRmas"
        ></Nav>
        <Header
                @selectRmas="selectRmas"
        ></Header>
        <keep-alive>
            <rmas-list
                    v-show="isSelectRmas"
                    :isHaveList="isSelectRmas"
                    :caseSubId="oneCase.caseSubId"
            ></rmas-list>
        </keep-alive>
        <keep-alive>
            <apply-for
                    v-show="!isSelectRmas"
                    :mycase="oneCase"
            ></apply-for>
        </keep-alive>
    </div>
</template>

<script>
import Header from "./component/Header";
import Nav from "./component/Nav";
import RmasList from "./component/Rmaslist";
import ApplyFor from "./component/ApplyFor";
export default {
  name: "CaseDetail",
  components: {
    Header,
    Nav,
    RmasList,
    ApplyFor,
  },
  data() {
    return {
      isSelectRmas: true,
      oneCase: {},
    };
  },
  methods: {
    goBackToCase() {
      this.$router.back(-1);
    },
    selectRmas(isSelectRmas) {
      this.isSelectRmas = isSelectRmas;
    },
    addRmas() {
      this.$router.push({ name: "addRmas", params: { mycase: this.oneCase } });
    }
  },
  beforeMount() {
    let routeFrom = this.$route.params.routerFrom;
    if (routeFrom == "Case") {
      this.oneCase = this.$route.params.oneCase;
      localStorage.oneCase = JSON.stringify(this.oneCase);
    } else {
      this.oneCase = JSON.parse(localStorage.oneCase);
    }
    console.log("beforMount caseDetail" + this.oneCase);
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .myCaseDetail
        background: $bgColor
        height: 100%
        width: 100%
        position: fixed
</style>
