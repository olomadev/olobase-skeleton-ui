import { defineStore, createPinia } from "pinia";
import axios from 'axios';

const store = defineStore('index', {
  state: () => {
    return { 
      locale: "en",
      modules: [],
      dialog: false,
      drawer: true,
      confirm: false,
      resolve: null,
      reject: null,
    }
  },
  getters: {
    getDialog(state) {
      return state.dialog;
    },
    getLocale(state) {
      return state.locale
    },
  },
  actions: {
    setModule(storeName, useStore) {
      this.modules[storeName] = useStore();
      return this.modules[storeName];
    },
    getModule(moduleName) {
      return this.modules[moduleName];
    },
    getResource(name) {
      this.modules["resource"].setResource(name);
      return this.modules["resource"];
    },
    setLocale(locale) {
      this.locale = locale;
      axios.defaults.headers.common['X-Client-Locale'] = locale;
    },
    getDrawer() {
      return this.drawer;
    },
    setDrawer(drawer) {
      this.drawer = drawer;
    },
    openDialog() {
      this.dialog = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    closeDialog() {
      this.dialog = false;
    },
    agreeDialog() {
      this.resolve(true);
      this.dialog = false;
    },
    cancelDialog() {
      this.resolve(false);
      this.dialog = false;
    },
  }
});

export default store;