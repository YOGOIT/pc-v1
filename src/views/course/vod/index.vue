<template>
  <div class="content">
    <filter-box
      v-show="!navLoading"
      :categories1="scenes"
      :categories2="categories"
      :cid1="pagination.scene"
      :cid2="pagination.category_id"
      @change="filterChange"
    ></filter-box>

    <template v-if="navLoading">
      <skeletonNav></skeletonNav>
      <skeletonNav2></skeletonNav2>
    </template>
    <template v-if="loading">
      <skeletonCourseList></skeletonCourseList>
    </template>
    <template v-else-if="list.length > 0">
      <div class="contanier">
        <div class="vod-course-item" v-for="course in list" :key="course.id">
          <vod-course-item
            :cid="course.id"
            :videos-count="course.videos_count"
            :thumb="course.thumb"
            :category="course.category"
            :title="course.title"
            :charge="course.charge"
            :is-free="course.is_free"
            :user-count="course.user_count"
          ></vod-course-item>
        </div>
      </div>
    </template>
    <none v-else></none>
    <div id="page" v-show="list.length > 0 && total > pagination.size">
      <page-box
        :totals="total"
        @current-change="changepage"
        :pageSize="pagination.size"
        :tab="false"
      ></page-box>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import None from "../../../components/none.vue";
import VodCourseItem from "../../../components/vod-course-item.vue";
import FilterBox from "../../../components/filter-box.vue";
import PageBox from "../../../components/page.vue";
import NavFooter from "../../../components/footer.vue";
import SkeletonCourseList from "../../../components/skeleton/skeletonCourseList.vue";
import SkeletonNav from "../../../components/skeleton/skeletonNav.vue";
import SkeletonNav2 from "../../../components/skeleton/skeletonNav2.vue";

export default {
  components: {
    VodCourseItem,
    FilterBox,
    PageBox,
    NavFooter,
    None,
    SkeletonCourseList,
    SkeletonNav,
    SkeletonNav2,
  },
  data() {
    return {
      scenes: [
        {
          id: "",
          name: "全部",
        },
        {
          id: "free",
          name: "免费",
        },
        {
          id: "sub",
          name: "热门",
        },
      ],
      list: [],
      total: null,
      pagination: {
        page: 1,
        size: 16,
        scene: "",
        category_id: 0,
      },
      categories: [],
      over: false,
      loading: false,
      navLoading: false,
    };
  },
  mounted() {
    this.navLoading = true;
    this.getCategories();
    this.getData();
  },
  methods: {
    filterChange(scene, cid) {
      this.pagination.scene = scene;
      this.pagination.category_id = cid;
      this.resetData();
      this.getData();
    },
    resetData() {
      this.list = [];
      this.pagination.page = 1;
    },
    changepage(item) {
      this.pagination.size = item.pageSize;
      this.pagination.page = item.currentPage;
      this.getData();
      window.scrollTo(0, 0);
    },
    getCategories() {
      this.$api.Course.Categories().then((res) => {
        this.navLoading = false;
        let categories = [];
        categories.push(...res.data);
        this.categories.push(...categories);
      });
    },
    getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$api.Course.List(this.pagination).then((res) => {
        this.loading = false;
        let list = res.data.data;
        this.total = res.data.total;
        if (list.length > 0) {
          this.list = list;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  .contanier {
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    display: grid;
    row-gap: 30px;
    column-gap: 48px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
  }
  #page {
    width: 1200px;
    margin: 0 auto;
    margin-top: 70px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
