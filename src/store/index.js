import { defineStore } from "pinia";
import mainNavigation from "@/@nav";
import axios from "@/helpers/axios";

const store = defineStore('index', {
  state: () => {
    return { 
      locale: "en",
      modules: [],
      navigations: [],
      drawer: true,
      navbarKey: 0,
    }
  },
  getters: {
    getNavbarKey() {
      return this.navbarKey;
    },
    getLocale() {
      return this.locale
    },
    getResource: (state) => {
      return function (name) {
        this.modules["resource"].setResource(name);
        return this.modules["resource"];
      }
    },
    getModule: (state) => {
      return function (name) {
        return this.modules[name];
      }
    },
    getDrawer() {
      return this.drawer;
    },
  },
  actions: {
    async buildNavs(t, admin) {
      // build module navigations
      let navigations = [];
      for (let i = 0; i < this.navigations.length; i++) {
        const navItems = await this.navigations[i].build(t, admin);
        navigations.push(...navItems);
      }
      // build main navigations
      const mainNav = await mainNavigation.build(t, admin);
      let fullNav = [...mainNav, ...navigations]; // merge with module navigations

      // sort navs..
      fullNav = fullNav.sort((a, b) => a.order - b.order);
      return fullNav;
    },
    setNavbarKey() {
      this.navbarKey = this.navbarKey + 1;
    },
    setModule(storeName, useStore) {
      this.modules[storeName] = useStore();
      return this.modules[storeName];
    },
    setLocale(locale) {
      this.locale = locale;
      axios.defaults.headers.common['X-Client-Locale'] = locale;
    },
    setDrawer(drawer) {
      this.drawer = drawer;
    },
  }
});

export default store;