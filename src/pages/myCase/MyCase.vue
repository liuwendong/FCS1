<template>
    <div class="myCase">
        <Nav
                @myGoBack="myGoBack"
                :isShow="ishaveCase && isSelectedCase"
        ></Nav>
        <Header
                @mySelected="mySelected"
        ></Header>
        <keep-alive>
            <Cases
                    v-show="isSelectedCase"
                    :ishaveCases="ishaveCase"
                    @getCases="getCases"
            ></Cases>
        </keep-alive>
        <keep-alive>
            <Applys
                    v-show="!isSelectedCase"
                    :isShow="!isSelectedCase"
            ></Applys>
        </keep-alive>
    </div>
</template>

<script>
import Nav from "./component/Nav";
import Header from "./component/Header";
import Cases from "./component/Cases";
import Applys from "./component/Applys";
export default {
  name: "MyCase",
  components: {
    Nav,
    Header,
    Cases,
    Applys
  },
  data() {
    return {
      isSelectedCase: true,
      ishaveCase: false
    };
  },
  methods: {
    myGoBack() {
      this.ishaveCase = false;
    },
    mySelected(isSelectedCase) {
      this.isSelectedCase = isSelectedCase;
    },
    getCases() {
      this.ishaveCase = true;
      localStorage.ishaveCase = true;
    }
  },
  mounted() {
    this.ishaveCase = localStorage.ishaveCase == "true";
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .myCase
        background: $bgColor
        height: 100%
        width: 100%
        position: fixed
</style>
