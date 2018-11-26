<template>
    <div class="addInfo">
        <div class="oneCase">
            <div class="oneline border-bottom">
                <div class="oneCase-key">催收时间：</div>
                <input class="oneCase-value" placeholder="请选择催收时间" v-model="rmasTime" @click="seletData" onfocus="this.blur()"/>
            </div>
            <div class="oneline border-bottom">
                <div class="oneCase-key">催收员：</div>
                <input class="oneCase-value" placeholder="请输入催收员" v-model="rmasEr" readonly/>
            </div>
            <div class="oneline border-bottom">
                <div class="oneCase-key">催收结果：</div>
                <input class="oneCase-value" placeholder="请选择催收结果" v-model="rmasResult" @click="showPick('result')" onfocus="this.blur()"/>
                <awesome-picker
                        ref="result"
                        :data=resultDatas
                        :colorConfirm=color
                        @confirm="handlePickerConfirm"
                ></awesome-picker>
            </div>
            <div class="oneline border-bottom">
                <div class="oneCase-key">面谈人姓名：</div>
                <input class="oneCase-value" placeholder="请输入面谈人姓名" v-model="rmasName"/>
            </div>
            <div class="oneline border-bottom">
                <div class="oneCase-key">面谈人关系：</div>
                <input class="oneCase-value" placeholder="请选择面谈人关系" v-model="rmasRelation" @click="showPick('relation')" onfocus="this.blur()"/>
                <awesome-picker
                        ref="relation"
                        :data=relationDatas
                        :colorConfirm=color
                        @confirm="handlePickerConfirm"
                ></awesome-picker>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "AddInfo",
  data() {
    return {
      rmasTime: "",
      rmasEr: localStorage.userId,
      rmasResult: "",
      rmasName: "",
      rmasRelation: "",
      pickType: "",
      color: "#55acee",
      resultDatas: [["已完成", "承诺还款", "已还款", "拒绝还款"]],
      relationDatas: [["本人","父母", "子女", "兄弟", "同事", "同学", "朋友", "其他"]]
    };
  },
  props: {
    clickSubmit: Boolean
  },
  methods: {
    seletData() {
      let vm = this;
      this.$picker.show({
        type: "datePicker",
        onOk: data => {
          console.log(data);
          vm.rmasTime = data;
        },
        onCancel() {
          console.log("取消");
        }
      });
    },
    showPick(type) {
      this.pickType = type;
      if (this.pickType === "result") {
        this.$refs.result.show();
      }
      if (this.pickType === "relation") {
        this.$refs.relation.show();
      }
    },
    handlePickerConfirm(e) {
      if (this.pickType === "result") {
        this.rmasResult = e[0].value;
      }
      if (this.pickType === "relation") {
        this.rmasRelation = e[0].value;
      }
    }
  },
  watch: {
    clickSubmit(newValue) {
      if (newValue === true) {
        //点击了提交 检测是否填写
        if (this.rmasTime.length == 0) {
          this.$emit("showDialog", "请选择催收时间");
        } else if (this.rmasEr.length == 0) {
          this.$emit("showDialog", "请输入催收员");
        } else if (this.rmasResult.length == 0) {
          this.$emit("showDialog", "请选择催收结果");
        } else if (this.rmasName.length == 0) {
          this.$emit("showDialog", "请输入面谈人姓名");
        } else if (this.rmasRelation.length == 0) {
          this.$emit("showDialog", "请选择面谈人关系");
        } else {
          var info = {
            collectionTime: this.rmasTime,
            collectionName: this.rmasEr,
            collectionResult: this.rmasResult,
            interviewName: this.rmasName,
            interviewRelationship: this.rmasRelation
          };
          this.$emit("infoOK", info);
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
    .addInfo
        margin-left .4rem
        .oneCase
            background: #ffffff
            .oneline
                display: flex
                height: .8rem
                .oneCase-key
                    float: left
                    font-size: .28rem
                    color: $font-color
                    text-align: left
                    width : 1.86rem
                    line-height: .8rem
                .oneCase-value
                    font-size: .28rem
                    color: $font-color
                    text-align: right
                    line-height: .8rem
                    padding-right: .4rem
                    flex: 1
</style>
