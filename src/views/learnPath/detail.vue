<template>
  <div class="content">
    <div class="fix-nav" v-show="isfixTab">
      <div class="tabs">
        <div
          class="item-tab"
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: currentTab === item.id }"
          @click="tabChange(item.id)"
          :is-scroll="false"
        >
          {{ item.name }}
          <div class="actline" v-if="currentTab === item.id"></div>
        </div>
      </div>
    </div>
    <div class="box">
      <template v-if="loading">
        <skeletonDetail></skeletonDetail>
      </template>
      <template v-else-if="learn">
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'learnPath' })">学习路径</a> /
          <span>{{ learn.name }}</span>
        </div>
        <div class="book-info">
          <div class="book-info-box">
            <div class="book-thumb">
              <img :src="learn.thumb" />
            </div>
            <div class="info">
              <div class="book-info-title">{{ learn.name }}</div>
              <p class="desc" v-html="learn.desc"></p>

              <template v-if="isBuy">
                <div class="see-button">已购买</div>
              </template>
              <template v-else>
                <div class="buy-button" v-if="learn.charge > 0" @click="buy()">
                  购买套餐￥{{ learn.charge }}
                </div>
              </template>
            </div>
          </div>
          <div class="tabs" id="NavBar">
            <div
              class="item-tab"
              v-for="(item, index) in tabs"
              :key="index"
              :class="{ active: currentTab === item.id }"
              @click="tabChange(item.id)"
              :is-scroll="false"
            >
              {{ item.name }}
              <div class="actline" v-if="currentTab === item.id"></div>
            </div>
          </div>
        </div>
        <div class="book-desc" v-if="learn" v-show="currentTab === 2">
          <div v-html="learn.desc"></div>
        </div>
        <div class="book-chapter-box" v-show="currentTab === 3">
          <template v-if="steps.length > 0">
            <div class="steps-box">
              <div class="step-item" v-for="item in steps" :key="item.id">
                <div class="step-title">
                  {{ item.name }}
                </div>
                <div class="step-desc">{{ item.desc }}</div>
                <div
                  class="courses-box"
                  :scroll-x="true"
                  v-if="item.courses.length > 0"
                >
                  <div
                    class="course-item"
                    @click="goDetail(courseItem)"
                    v-for="courseItem in item.courses"
                    :key="courseItem.id"
                  >
                    <div class="course-thumb">
                      <div class="spback"></div>
                      <img
                        :class="{ active: courseItem.type === 'book' }"
                        :src="courseItem.thumb"
                      />
                    </div>
                    <div class="course-body">
                      <div class="course-type">{{ courseItem.type_text }}</div>
                      <div class="course-name">{{ courseItem.name }}</div>
                      <div class="course-free" v-if="courseItem.charge === 0">
                        免费
                      </div>
                      <div class="course-charge" v-else>
                        ￥{{ courseItem.charge }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../components/footer.vue";
import SkeletonDetail from "../../components/skeleton/skeletonDetail.vue";

export default {
  components: {
    NavFooter,
    SkeletonDetail,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      learn: [],
      currentTab: 2,
      steps: [],
      tabs: [
        {
          name: "课程详情",
          id: 2,
        },
        {
          name: "套餐课程",
          id: 3,
        },
      ],
      isBuy: false,

      isfixTab: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleTabFix, true);
    this.getDetail();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleTabFix, true);
  },
  methods: {
    ...mapMutations(["showLoginDialog", "changeDialogType"]),
    goLogin() {
      this.changeDialogType(1);
      this.showLoginDialog();
    },

    handleTabFix() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let navbar = document.querySelector("#NavBar");
      if (navbar) {
        let offsetTop = navbar.offsetTop;
        scrollTop > offsetTop
          ? (this.isfixTab = true)
          : (this.isfixTab = false);
      }
    },

    tabChange(key) {
      this.currentTab = key;
    },
    buy() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "path",
          goods_charge: this.learn.charge,
          goods_label: "学习路径",
          goods_name: this.learn.name,
          goods_id: this.learn.id,
          goods_thumb: this.learn.thumb,
        },
      });
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    goDetail(item) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      let page = "";
      if (item.type === "course") {
        page = "coursesDetail";
      } else if (item.type === "book") {
        page = "bookDetail";
      } else if (item.type === "live") {
        page = "liveDetail";
      } else if (item.type === "paper_practice") {
        page = "ExamPracticeDetail";
      } else if (item.type === "paper_paper") {
        page = "ExamPapersDetail";
      }
      this.$router.push({
        name: page,
        query: {
          id: item.other_id,
        },
      });
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.LearnPath.Detail(this.id).then((res) => {
        this.loading = false;
        this.learn = res.data.data;
        this.steps = res.data.steps;
        this.isBuy = res.data.is_buy;
        document.title = res.data.data.name;
      });
    },
  },
};
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  .fix-nav {
    width: 100%;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 50;
    .tabs {
      width: 1200px;
      margin: 0 auto;
      height: 72px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      padding: 28px 30px;
      border-radius: 0px 0px 8px 8px;
      .item-tab {
        width: 64px;
        height: 16px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        margin-right: 80px;
        cursor: pointer;
        position: relative;
        &.active {
          font-weight: 600;
          color: #3ca7fa;
        }
        .actline {
          width: 52px;
          height: 4px;
          background: #3ca7fa;
          position: absolute;
          left: 6px;
          top: 40px;
        }
      }
    }
  }
  .box {
    width: 1200px;
    margin: 0 auto;
    .nav {
      width: 100%;
      height: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #999999;
      line-height: 14px;
      margin-top: 30px;
      margin-bottom: 30px;
      a {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 6px;
        &:not(:first-of-type) {
          margin-left: 6px;
        }
      }
      span {
        height: 14px;
        margin-left: 6px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 14px;
      }
    }
    .book-info {
      width: 1200px;
      height: 372px;
      background: #ffffff;
      border-radius: 8px;
      .book-info-box {
        width: 1200px;
        height: 300px;
        box-sizing: border-box;
        padding: 30px 50px 30px 30px;
        position: relative;
        display: flex;
        flex-direction: row;
        .book-thumb {
          width: 320px;
          height: 240px;
          border-radius: 8px;
          margin-right: 50px;
          position: relative;
          img {
            width: 320px;
            height: 240px;
            border-radius: 8px;
          }
          .status {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(60, 167, 250);
            color: #fff;
            font-size: 14px;
            padding: 4px;
            border-radius: 4px;
          }
        }
        .info {
          width: 750px;
          height: 240px;
          position: relative;
          .book-info-title {
            width: 710px;
            height: 30px;
            font-size: 24px;
            font-weight: 500;
            color: #333333;
            line-height: 24px;
            margin-top: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .collect-button {
            width: 29px;
            height: 29px;
            position: absolute;
            right: 0;
            top: 18px;
            cursor: pointer;
          }
          .desc {
            margin-top: 14px;
            width: 750px;
            height: 164px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
          }
          .see-button {
            position: absolute;
            background: #3ca7fa;
            border-radius: 4px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
          .buy-button {
            position: absolute;
            background: #ff5068;
            border-radius: 4px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      .tabs {
        width: 1200px;
        height: 72px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        padding: 28px 30px;
        .item-tab {
          width: 64px;
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          margin-right: 70px;
          text-align: center;
          cursor: pointer;
          position: relative;
          &.active {
            font-weight: 600;
            color: #3ca7fa;
          }
          .actline {
            width: 52px;
            height: 4px;
            background: #3ca7fa;
            position: absolute;
            left: 6px;
            top: 40px;
          }
        }
      }
    }
    .book-desc {
      padding: 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 28px;
    }
    .book-chapter-box {
      width: 1200px;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .steps-box {
        width: 100%;
        height: auto;
        .step-item {
          width: 100%;
          height: auto;
          &:not(:last-child) {
            margin-bottom: 50px;
          }
          .step-title {
            width: 100%;
            height: 20px;
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
            margin-bottom: 15px;
          }
          .step-desc {
            width: 100%;
            height: auto;
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            line-height: 28px;
            margin-bottom: 30px;
          }
          .courses-box {
            width: 100%;
            height: auto;
            .course-item {
              width: 100%;
              height: 100px;
              display: flex;
              flex-direction: row;
              align-items: center;
              position: relative;
              cursor: pointer;
              &:not(:last-child) {
                margin-bottom: 30px;
              }
              .course-thumb {
                width: 133px;
                height: 100px;
                background: #f0f0f8;
                border-radius: 4px;
                margin-right: 30px;
                display: flex;
                justify-content: center;
                .spback {
                  position: absolute;
                  left: 20px;
                  top: 10px;
                  width: 93px;
                  height: 80px;
                  background: #d2e1ef;
                  border-radius: 8px;
                }
                img {
                  width: 133px;
                  height: 100px;
                  z-index: 10;
                  border-radius: 4px;
                  &.active {
                    width: 75px;
                  }
                }
              }
              .course-body {
                height: 100px;
                display: flex;
                flex-direction: column;
                .course-type {
                  width: 56px;
                  height: 22px;
                  background: #04c877;
                  border-radius: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 400;
                  color: #ffffff;
                  margin-bottom: 20px;
                }
                .course-name {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 600;
                  color: #333333;
                  line-height: 14px;
                  margin-bottom: 20px;
                }
                .course-charge {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #ff5068;
                  line-height: 14px;
                }
                .course-free {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #04c877;
                  line-height: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>