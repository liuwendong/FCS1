<template>
    <div class="check">
        <check-nav></check-nav>
        <check-header
                @checked="mySelected"
        ></check-header>
        <keep-alive>
            <CheckWaiting
                    :isShow="!isSelectedChecked"
            ></CheckWaiting>
        </keep-alive>
        <keep-alive>
            <Checked
                    :isShow="isSelectedChecked"
            ></Checked>
        </keep-alive>

    </div>
</template>

<script>
import CheckNav from "./component/CheckNav";
import CheckHeader from "./component/CheckHeader";
import Checked from "./component/Checked";
import CheckWaiting from "./component/CheckWaiting";
export default {
  name: "Check",
  data() {
    return {
      isSelectedChecked: false
    };
  },
  components: {
    CheckNav,
    CheckHeader,
    Checked,
    CheckWaiting
  },
  methods: {
    mySelected(isSelectedChecked) {
      this.isSelectedChecked = isSelectedChecked;
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import "~styles/varibles.styl"
    .check
        background: $bgColor
        height: 100%
        width: 100%
        position: fixed
</style>
