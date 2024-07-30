import { defineStore } from "pinia";
import axios from 'axios';

const store = defineStore('index', {
  state: () => {
    return { 
      locale: "en",
      modules: [],
      dialog: false,
      confirm: false,
      resolve: null,
      reject: null,
    }
  },
  actions: {
    registerModule(storeName, useStore) {
      console.error(storeName);
      this.modules[storeName] = useStore();
      return this.modules[storeName];
    },
    getModule(moduleName) {
      return this.modules[moduleName];
    },
    setLocale(locale) {
      this.locale = locale;
      axios.defaults.headers.common['X-Client-Locale'] = locale;
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
  },
  getters: {
    getDialog(state) {
      return state.dialog;
    },
    getLocale(state) {
      return state.locale
    }
  }
});

export default store;