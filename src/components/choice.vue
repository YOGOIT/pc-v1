<template>
  <div class="choice-item">
    <div class="info" :class="{ spcolor: spcolor }">
      <span class="tit"
        >{{num}}.{{ question.type_text }}（{{ question.score }}分）</span
      >
    </div>
    <div class="question-content" :class="{ spcolor: spcolor }">
      <div v-html="question.content"></div>
    </div>
    <div class="choice-box" :class="{ spcolor: spcolor }">
      <template v-for="item in 10">
        <div
          class="choice-tap-item"
          :key="item"
          :class="{ active: 'option' + item === active }"
          @click="change(item)"
          v-if="question['option' + item]"
        >
          <div class="index">{{ optionTypeTextMap["option" + item] }}</div>
          <div class="content" :class="{ spcolor: spcolor }">
            <div v-html="question['option' + item]"></div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="isOver">
      <div class="analysis-box" :class="{ spcolor: spcolor }">
        <div class="pop-box">
          <div class="status" v-if="!wrongBook">
            <span class="success" v-if="isCorrect">正确</span>
            <span class="error" v-else>错误</span>
            <span class="score" v-if="isCorrect === 1"
              >得分：{{ score }}分</span
            >
          </div>
          <div class="answer">
            答案：{{ optionTypeTextMap[question.answer] }}
          </div>
          <div class="remark" v-if="question.remark">
            <div>解析：</div>
            <div v-html="question.remark"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: [
    "question",
    "reply",
    "isCorrect",
    "isOver",
    "score",
    "wrongBook",
    "spcolor",
    "num",
  ],
  data() {
    return {
      loading: false,
      active: null,
      optionTypeTextMap: {
        option1: "A",
        option2: "B",
        option3: "C",
        option4: "D",
        option5: "E",
        option6: "F",
        option7: "G",
        option8: "H",
        option9: "I",
        option10: "J",
      },
    };
  },
  mounted() {
    this.active = this.reply;
  },
  watch: {
    reply() {
      this.active = this.reply;
    },
  },
  methods: {
    change(index) {
      if (this.isOver) {
        return;
      }
      this.active = "option" + index;
      this.$emit("update", this.question.id, this.active);
    },
  },
};
</script>
<style lang='less' scoped>
.spcolor {
  background: #f4fafe !important;
}
.choice-item {
  background-color: #f1f2f6;
  width: 100%;

  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 30px 0px 30px;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */
    .tit {
      height: 18px;
      font-size: 18px;
      font-weight: 500;
      color: #666666;
      line-height: 18px;
    }
  }
  .question-content {
    width: 100%;
    height: auto;
    font-size: 15px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    padding: 30px 30px 0px 30px;
    background-color: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */
  }
  .choice-box {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 30px;
    background-color: #fff;
    .choice-tap-item {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      display: flex;
      margin-bottom: 30px;
      border-radius: 3px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      &.active .index {
        background: #3ca7fa;
        border: 1px solid #3ca7fa;
        color: #fff;
      }

      .index {
        width: 30px;
        height: 30px;
        border: 1px solid #cccccc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }

      .content {
        flex: 1;
        color: #333333;
        padding-left: 20px;
        line-height: 24px;
        font-size: 16px;
        font-weight: 400;
        background-color: #fff;

        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
  