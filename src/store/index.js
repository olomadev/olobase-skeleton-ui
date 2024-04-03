import { createStore } from "vuex";
import axios from 'axios';

const store = createStore({
  state: {
    locale: "en",
    showDialog: false,
    confirm: false,
    resolve: null,
    reject: null,
  },
  actions: {
    setLocale({ commit }, locale) {
      commit("SET_LOCALE", locale);
    },
    openDialog({ commit, state }) {
      commit("TOGGLE_DIALOG", true);
      return new Promise((resolve, reject) => {
        state.resolve = resolve;
        state.reject = reject;
      });
    },
  },
  getters: {
    dialog(state) {
      return state.showDialog;
    },
    getLocale(state) {
      return state.locale
    }
  },
  mutations: {
    // do not remove these methods
    SET_LOCALE(state, locale) {
      state.locale = locale;
      axios.defaults.headers.common['X-Client-Locale'] = locale;
    },
    TOGGLE_DIALOG(state, bool) {
      state.showDialog = bool;
    },
    TOGGLE_DIALOG(state, bool) {
      state.showDialog = bool;
    },
    TOGGLE_AGREE(state) {
      state.resolve(true);
      state.showDialog = false;
    },
    TOGGLE_CANCEL(state) {
      state.resolve(false);
      state.showDialog = false;
    },
  },
  modules: {},
});

export default store;
