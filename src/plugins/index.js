/**
 * @oloma.dev (c) 2022-2024
 *
 * - plugins/index.js
 * 
 * automatically included in `./src/main.js`
 */
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import i18n from "../i18n";
import admin from "./admin";
import loader from "./loader";
import useStore from "../store";
import resources from "@/resources";
import { useHttp } from "../plugins/useHttp";
import axios from "axios";
import cookies from "olobase-admin/src/utils/cookies";
/**
 * Get cookie constants object
 */
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);
import { createPinia } from 'pinia';
const pinia = createPinia();
/**
 * Set default global http configuration
 */
axios.defaults.timeout = 20000;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = "application/json";
axios.defaults.headers.common['X-Client-Locale'] = i18n.global.locale.value;
axios.interceptors.request.use(
  function (config) {
    let token = cookies.get(cookieKey.token);
    if (typeof token == "undefined" || token == "undefined" || token == "") {
      return config;
    }
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
useHttp(axios); // global instance
/**
 * Main register function
 */
export function registerPlugins(app) {
  loadFonts();
  loader.install(app);
  app
    .use(pinia)
    .use(vuetify)
    .use(i18n)
    .use(router);
  const store = useStore();
  app.use(store);
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$vuetify = vuetify;
  admin.install(app, store, axios, resources);
}
