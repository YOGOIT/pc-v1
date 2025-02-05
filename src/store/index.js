import Vue from "vue";
import Vuex from "vuex";
import Utils from "@/js/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: false,
    config: null,
    loginDialogStatus: false,
    loginDialogType: 0,
    bindWeixin: 0,
    dialogMobile: null,
    freshUnread: false,
    sucbind: false,
    configFunc: {
      vip: true,
      live: false,
      book: false,
      topic: false,
      paper: false,
      practice: false,
      mockPaper: false,
      wrongBook: false,
      wenda: false,
      share: false,
      codeExchanger: false,
      snapshort: false,
      ke: false,
      promoCode: false,
      daySignIn: false,
    },
  },
  mutations: {
    loginHandle(state, user) {
      state.user = user;
      state.freshUnread = true;
      state.isLogin = true;
    },
    logout(state) {
      state.user = null;
      state.isLogin = false;
      this.keywords = null;
      Utils.clearToken();
    },
    saveUnread(state) {
      state.freshUnread = true;
    },
    removeUnread(state) {
      state.freshUnread = false;
    },
    setConfig(state, config) {
      state.config = config;
    },
    hideLoginDialog(state) {
      state.loginDialogType = 0;
      state.loginDialogStatus = false;
    },
    showLoginDialog(state) {
      state.loginDialogStatus = true;
    },
    changeDialogType(state, val) {
      state.loginDialogType = val;
    },
    saveDialogMobile(state, val) {
      state.dialogMobile = val;
    },
    saveBindWeixin(state, val) {
      state.bindWeixin = val;
    },
    bindSuccess(state, val) {
      state.sucbind = true;
    },
    removeBind(state) {
      state.sucbind = false;
    },
    updateFuncConfig(state, func) {
      state.configFunc = func;
    },
  },
  actions: {},
  modules: {},
});
