<template>
  <div class="content">
    <course-dialog
      :courseCharge="dialog.courseCharge"
      :videoCharge="dialog.videoCharge"
      :vipFree="dialog.vipFree"
      :configText="dialog.configText"
      :status="dialog.status"
      :is_ban_sell="dialog.is_ban_sell"
      @payOrder="paySelect"
      @hideDialog="hideDialog"
    ></course-dialog>
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
      <template v-else-if="course">
        <historyRecord
          :id="course.id"
          :title="course.title"
          type="vod"
        ></historyRecord>
        <div class="nav">
          <a @click="$router.push({ name: 'index' })">首页</a> /
          <a @click="$router.push({ name: 'courses' })">点播课</a> /
          <span>{{ course.title }}</span>
        </div>
        <div class="course-info">
          <div class="course-info-box">
            <div class="course-thumb">
              <img :src="course.thumb" />
            </div>
            <div class="info">
              <div class="course-info-title">{{ course.title }}</div>
              <div
                class="collect-button"
                :class="{ active: isCollect }"
                @click="collectCourse"
              >
                <img
                  v-if="isCollect"
                  class="like-icon"
                  src="../../../assets/img/commen/icon-collect-h.png"
                />
                <img
                  v-else
                  class="like-icon"
                  src="../../../assets/img/commen/icon-collect-n.png"
                />
              </div>
              <p class="desc">{{ course.short_description }}</p>
              <template v-if="!isBuy && course.charge !== 0">
                <div
                  class="buy-button"
                  v-if="course.charge > 0"
                  @click="buyCourse()"
                >
                  订阅课程￥{{ course.charge }}
                </div>
                <div
                  class="role-button"
                  v-if="course.vip_can_view === 1"
                  @click="goRole()"
                >
                  会员免费看
                </div>
              </template>
              <template v-if="course.is_free === 1">
                <div class="has-button">本课程免费</div>
              </template>
              <template v-if="course.is_free !== 1 && isBuy">
                <div class="has-button">课程已购买</div>
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
        <div class="coursr-desc" v-if="course" v-show="currentTab === 2">
          <div v-html="course.render_desc"></div>
        </div>
        <div class="course-chapter-box" v-show="currentTab === 3">
          <template v-if="chapters.length > 0">
            <div
              class="chapter-item"
              v-for="chapter in chapters"
              :key="chapter.id"
            >
              <div class="chapter-name">{{ chapter.title }}</div>
              <div class="chapter-videos-box">
                <div
                  class="video-item"
                  @click="goPlay(video)"
                  v-for="video in videos[chapter.id]"
                  :key="video.id"
                >
                  <img
                    class="play-icon"
                    v-if="
                      isBuy ||
                      course.is_free === 1 ||
                      video.charge === 0 ||
                      buyVideos.indexOf(video.id) !== -1
                    "
                    src="../../../assets/img/commen/icon-unlock.png"
                  />
                  <img
                    class="play-icon"
                    v-else
                    src="../../../assets/img/commen/icon-lock.png"
                  />
                  <div class="video-title">
                    <span class="text">{{ video.title }}</span>
                    <span
                      class="free"
                      v-if="course.is_free !== 1 && video.free_seconds > 0"
                      >试看</span
                    >
                  </div>
                  <div class="video-info">
                    <template>
                      <duration :seconds="video.duration"></duration>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="video-item"
              @click="goPlay(video)"
              v-for="video in videos[0]"
              :key="video.id"
            >
              <img
                class="play-icon"
                v-if="
                  isBuy ||
                  course.is_free === 1 ||
                  video.charge === 0 ||
                  buyVideos.indexOf(video.id) !== -1
                "
                src="../../../assets/img/commen/icon-unlock.png"
              />
              <img
                class="play-icon"
                v-else
                src="../../../assets/img/commen/icon-lock.png"
              />
              <div class="video-title">
                <span class="text">{{ video.title }}</span>
                <span
                  class="free"
                  v-if="course.is_free !== 1 && video.free_seconds > 0"
                  >试看</span
                >
              </div>
              <div class="video-duration">
                <duration :seconds="video.duration"></duration>
              </div>
            </div>
          </template>
        </div>
        <div class="course-comments-box" v-show="currentTab === 4">
          <div class="comment-divider">全部评论</div>
          <div class="line"></div>
          <template v-if="isLogin">
            <div v-if="isBuy" class="replybox">
              <div class="reply">
                <img class="user-avatar" :src="user.avatar" />
                <input
                  type="text"
                  class="reply-input"
                  placeholder="此处填写你的评论"
                  v-model="comment.content"
                />
                <div
                  class="btn-submit"
                  :class="{ active: comment.content.length > 0 }"
                  @click="submitComment"
                >
                  评论
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="replybox">
              <div class="text" @click="goLogin()">未登录，请登录后再评论</div>
            </div>
          </template>
          <div class="comment-top">
            <template v-if="comments.length > 0">
              <div
                class="comment-item"
                v-for="comment in comments"
                :key="comment.id"
              >
                <div class="user-avatar">
                  <img :src="commentUsers[comment.user_id].avatar" />
                </div>
                <div class="comment-content">
                  <div class="comment-info">
                    <div class="nickname">
                      {{ commentUsers[comment.user_id].nick_name }}
                    </div>
                    <div class="comment-time">
                      {{ comment.created_at | changeTime }}
                    </div>
                  </div>

                  <div
                    class="comment-text"
                    v-html="comment.render_content"
                  ></div>
                </div>
              </div>
            </template>
            <none v-else type="white"></none>
          </div>
        </div>
        <div class="attach-list-box" v-show="currentTab === 5">
          <template v-if="attach.length > 0">
            <div class="attach-item" v-for="item in attach" :key="item.id">
              <div class="attach-name">{{ item.name }}</div>
              <a @click="download(item.id)" class="download-attach">下载附件</a>
            </div>
          </template>
          <none v-else type="white"></none>
        </div>
      </template>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import Utils from "@/js/utils";
import { mapState, mapMutations } from "vuex";
import NavFooter from "../../../components/footer.vue";
import Duration from "../../../components/duration.vue";
import CourseDialog from "../../../components/coursedialog.vue";
import None from "../../../components/none.vue";
import HistoryRecord from "../../../components/history-record.vue";
import SkeletonDetail from "../../../components/skeleton/skeletonDetail.vue";

export default {
  components: {
    NavFooter,
    Duration,
    CourseDialog,
    None,
    HistoryRecord,
    SkeletonDetail,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      isCollect: false,
      course: null,
      currentTab: 2,
      nowTime: Date.parse(new Date()) / 1000,
      buyVideos: null,
      attach: [],
      chapters: [],
      tabs: [
        {
          name: "课程详情",
          id: 2,
        },
        {
          name: "课程目录",
          id: 3,
        },
        {
          name: "课程评论",
          id: 4,
        },
        {
          name: "课程附件",
          id: 5,
        },
      ],
      dialog: {
        id: null,
        courseCharge: null,
        videoCharge: null,
        vipFree: null,
        configText: null,
        status: false,
        is_ban_sell: null,
      },
      isBuy: false,
      comments: [],
      commentUsers: {},
      comment: {
        content: "",
      },
      isfixTab: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "config"]),
  },
  mounted() {
    window.addEventListener("scroll", this.handleTabFix, true);
    this.getDetail();
    this.getComments();
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
    goPlay(item) {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      if (this.course.is_free === 1 || this.isBuy) {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: item.id,
          },
        });
      } else if (
        this.course.is_free !== 1 &&
        (item.charge === 0 || item.free_seconds > 0)
      ) {
        this.$router.push({
          name: "coursesVideo",
          query: {
            id: item.id,
          },
        });
      } else if (this.buyVideos) {
        let hasvideos = this.buyVideos;
        let has = false;
        for (var i = 0; i < hasvideos.length; i++) {
          if (hasvideos[i] === item.id) {
            has = true;
          } else {
            has = false;
          }
        }
        if (has) {
          this.$router.push({
            name: "coursesVideo",
            query: {
              id: item.id,
            },
          });
        } else {
          this.dialog.id = item.id;
          this.dialog.status = true;
          this.dialog.courseCharge = this.course.charge;
          this.dialog.videoCharge = item.charge;
          this.dialog.vipFree = this.course.is_free;
          this.dialog.configText = item.title;
          this.dialog.is_ban_sell = item.is_ban_sell;
        }
      } else {
        this.dialog.id = item.id;
        this.dialog.status = true;
        this.dialog.courseCharge = this.course.charge;
        this.dialog.videoCharge = item.charge;
        this.dialog.vipFree = this.course.is_free;
        this.dialog.configText = item.title;
        this.dialog.is_ban_sell = item.is_ban_sell;
      }
    },
    paySelect(val) {
      if (val === 2) {
        this.goRole();
        return;
      }
      if (val === 1) {
        this.$router.push({
          name: "order",
          query: {
            goods_type: "vod",
            goods_charge: this.course.charge,
            goods_label: "点播课程",
            goods_name: this.course.title,
            goods_id: this.course.id,
            goods_thumb: this.course.thumb,
          },
        });
        return;
      }
      if (val === 3) {
        this.$router.push({
          name: "order",
          query: {
            goods_type: "video",
            goods_charge: this.dialog.videoCharge,
            goods_label: "视频",
            goods_name: this.dialog.configText,
            goods_id: this.dialog.id,
            goods_thumb: this.course.thumb,
          },
        });
        return;
      }
    },
    goRole() {
      this.$router.push({
        name: "vip",
      });
    },
    hideDialog() {
      this.dialog.status = false;
    },
    buyCourse() {
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      this.$router.push({
        name: "order",
        query: {
          goods_type: "vod",
          goods_charge: this.course.charge,
          goods_label: "点播课程",
          goods_name: this.course.title,
          goods_id: this.course.id,
          goods_thumb: this.course.thumb,
        },
      });
    },
    download(id) {
      let token = Utils.getToken();
      if (!this.isLogin) {
        this.goLogin();
        return;
      }
      window.open(
        `${this.config.url}/api/v2/course/attach/${id}/download?token=${token}`
      );
    },
    getDetail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Course.Detail(this.id)
        .then((res) => {
          this.loading = false;
          this.course = res.data.course;
          this.attach = res.data.attach;
          this.chapters = res.data.chapters;
          this.isBuy = res.data.isBuy;
          document.title = res.data.course.title;
          this.isCollect = res.data.isCollect;
          this.videoWatchedProgress = res.data.videoWatchedProgress;
          this.videos = res.data.videos;
          this.buyVideos = res.data.buyVideos;
        })
        .catch((e) => {
          this.$message.error("获取课程失败");
        });
    },
    getComments() {
      if (this.comment.loading) {
        return;
      }
      this.comment.loading = true;
      this.$api.Course.Comments(this.id)
        .then((res) => {
          this.comments = res.data.comments;
          this.commentUsers = res.data.users;
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    collectCourse() {
      if (this.isLogin) {
        this.$api.Course.Collect(this.id)
          .then(() => {
            this.isCollect = !this.isCollect;
            if (this.isCollect) {
              this.$message.success("已收藏");
            } else {
              this.$message.success("取消收藏");
            }
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      } else {
        this.goLogin();
      }
    },
    resetComments() {
      this.comment.loading = false;
      this.comment.content = "";
      this.comments = [];
      this.commentUsers = [];
    },
    submitComment() {
      if (this.comment.content.length === 0) {
        return;
      }
      this.$api.Course.SubmitComment(this.id, this.comment)
        .then(() => {
          this.$message.success("成功");
          this.resetComments();
          this.getComments();
        })
        .catch((e) => {
          this.$message.error(e.message);
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
    .course-info {
      width: 1200px;
      height: 372px;
      background: #ffffff;
      border-radius: 8px;
      .course-info-box {
        width: 1200px;
        height: 300px;
        box-sizing: border-box;
        padding: 30px 50px 30px 30px;
        position: relative;
        display: flex;
        flex-direction: row;
        .course-thumb {
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
          .course-info-title {
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
            height: 90px;
            font-size: 16px;
            font-weight: 400;
            color: #666666;
            line-height: 30px;
            overflow: hidden;
          }
          .has-button {
            position: absolute;
            background: #f4fafe;
            border-radius: 4px;
            padding: 20px;
            font-size: 16px;
            font-weight: 400;
            color: #999999;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            cursor: pointer;
          }
          .buy-button {
            position: absolute;
            background: #ff5068;
            border-radius: 4px;
            padding: 20px;
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
          .role-button {
            position: absolute;
            background: #e1a500;
            border-radius: 4px;
            padding: 20px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            box-sizing: border-box;
            bottom: 0;
            left: 176px;
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
    .course-teacher-box {
      width: 1200px;
      height: 270px;
      background: #ffffff;
      border-radius: 8px;
      margin-top: 30px;
      padding: 30px 50px;
      box-sizing: border-box;
      .teacher {
        width: auto;
        height: 80px;
        display: flex;
        align-items: center;
        flex-direction: row;
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 20px;
        }
        a {
          width: 100%;
          height: 24px;
          font-size: 24px;
          font-weight: 600;
          color: #333333;
          line-height: 24px;
        }
      }
      .teacher-desc {
        margin-top: 26px;
        width: 100%;
        height: 64px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 32px;
        overflow: hidden;
      }
    }
    .coursr-desc {
      padding: 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #121212;
      line-height: 28px;
    }
    .course-chapter-box {
      width: 1200px;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .video-item {
        width: 100%;
        height: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        margin-top: 30px;
        cursor: pointer;
        &:first-child {
          margin-top: 0px;
        }

        .play-icon {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
        .video-title {
          height: 22px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
          margin-left: 15px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .free {
            margin-left: 15px;
            width: 44px;
            height: 22px;
            background: #04c877;
            border-radius: 2px;
            color: #fff;
            font-size: 12px;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .video-duration {
          position: absolute;
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
          top: 5px;
          right: 0;
        }
      }
      .chapter-item {
        width: 100%;
        height: auto;
        margin-top: 50px;
        &:first-child {
          margin-top: 0px;
        }
        .chapter-name {
          width: 100%;
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
          margin-bottom: 30px;
          &:first-child {
            margin-bottom: 0px;
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
        .chapter-videos-box {
          width: 100%;
          height: auto;
          .video-item {
            width: 100%;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            cursor: pointer;
            margin-top: 30px;

            .play-icon {
              width: 24px;
              height: 24px;
              cursor: pointer;
            }
            .video-title {
              height: 22px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 14px;
              margin-left: 15px;
              display: flex;
              flex-direction: row;
              align-items: center;
              .free {
                margin-left: 15px;
                width: 44px;
                height: 22px;
                background: #04c877;
                border-radius: 2px;
                color: #fff;
                font-size: 12px;
                font-weight: 400;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .video-info {
              position: absolute;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 14px;
              top: 5px;
              right: 0;
            }
          }
        }
      }
    }
    .course-comments-box {
      width: 1200px;
      box-sizing: border-box;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      padding: 30px;
      .comment-divider {
        width: 100%;
        height: 18px;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        line-height: 18px;
      }
      .line {
        width: 100%;
        height: 1px;
        background: #e5e5e5;
        margin: 30px 0px;
      }

      .comment-top {
        box-sizing: border-box;
        width: 100%;
        padding: 0;
        display: flex;
        flex-direction: column;
        #page {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .comment-item {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 50px;
          &:last-child {
            margin-bottom: 0px;
          }
          .user-avatar {
            width: 48px;
            height: 48px;
            background: #d8d8d8;
            border-radius: 50%;
            margin-right: 30px;
            img {
              width: 48px;
              height: 48px;
              border-radius: 50%;
            }
          }
          .comment-content {
            width: 1062px;
            display: flex;
            flex-direction: column;
            .comment-info {
              margin-top: 3px;
              display: flex;
              flex-direction: row;
              height: 14px;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 14px;
              margin-bottom: 16px;
              .nickname {
                margin-right: 15px;
              }
            }
            .comment-text {
              width: 1062px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        }
      }

      .replybox {
        box-sizing: border-box;
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 50px;
        .text {
          width: 100%;
          text-align: center;
          cursor: pointer;
          &:hover {
            color: #3ca7fa;
            text-decoration: underline;
          }
        }
        .reply {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          .user-avatar {
            width: 48px;
            height: 48px;
            background: #d8d8d8;
            border-radius: 50%;
            margin-right: 30px;
          }
          .reply-input {
            width: 960px;
            height: 48px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            padding-left: 10px;
            margin-right: 30px;
            outline: none;
          }
          .btn-submit {
            width: 72px;
            height: 48px;
            background: #cccccc;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
            &.active {
              background: #3ca7fa;
            }
          }
        }
      }
    }
    .attach-list-box {
      width: 1200px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 50px 30px;
      background: #ffffff;
      margin-top: 30px;
      border-radius: 8px;
      .attach-item {
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 50px;
        &:first-child {
          margin-top: 0px;
        }

        .attach-name {
          height: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          line-height: 16px;
        }
        .download-attach {
          margin-left: 30px;
          width: 104px;
          height: 40px;
          background: #3ca7fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>