<template>
  <div class="share">
    <span>分享到</span>
    <a class="qq" v-if="qq.url" target="_blank" :href="qq.url"
      ><img
        class="qq-icon"
        width="40"
        height="40"
        src="../assets/img/commen/icon-qq.png"
    /></a>
    <a class="sina" v-if="sina.url" target="_blank" :href="sina.url"
      ><img
        class="sina-icon"
        width="40"
        height="40"
        src="../assets/img/commen/icon-weibo.png"
    /></a>
    <div class="seen" v-show="seen">
      <div id="qrcode"></div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
export default {
  props: ["title", "thumb", "cid"],
  data() {
    return {
      seen: false,
      qq: {
        url: null,
      },
      sina: {
        url: null,
      },
    };
  },
  watch: {
    title() {
      this.getData();
    },
    thumb() {
      this.getData();
    },
    cid() {
      this.getData();
    },
  },
  created() {},
  mounted() {},
  methods: {
    enter() {
      this.seen = true;
    },
    leave() {
      this.seen = false;
    },
    getData() {
      this.qq.url =
        "https://connect.qq.com/widget/shareqq/index.html?url=https%3A%2F%2Fall.meedu.tech%2Ftopic%2Fdetail%3Fid%3D" +
        this.cid +
        "&title=" +
        this.title +
        "&summary=" +
        this.title +
        "&pics=" +
        this.thumb +
        "&site=MeEdu测试站";

      this.sina.url =
        "https://service.weibo.com/share/share.php?url=https%3A%2F%2Fall.meedu.tech%2Ftopic%2Fdetail%3Fid%3D" +
        this.cid +
        "&title=" +
        this.title +
        "&pic=" +
        this.thumb;
    },
  },
};
</script>
<style lang='less' scoped>
.share {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  span {
    height: 14px;
    font-size: 14px;
    margin-right: 30px;
    font-weight: 400;
    color: #666666;
    line-height: 14px;
  }
  .seen {
    position: absolute;
    top: 40px;
    left: 52px;
    width: 220px;
    height: 224px;
    background-image: url("../assets/img/commen/share-wechat.png");
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    #qrcode {
      width: 120px;
      height: 120px;
    }
  }
  a {
    cursor: pointer;
    width: 40px;
    height: 40px;

    &.qq {
      margin-right: 26px;
    }
    &.wechat {
      margin-right: 26px;
    }
  }
}
</style>