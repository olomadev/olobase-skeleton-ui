/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/index.js
 * 
 * automatically included in `./src/main.js`
 */
import vuetify from "./vuetify";
import router from "../router";
import i18n from "../i18n";
import admin from "./admin";
import loader from "./loader";
import useStore from "../store";
import { useHttp } from "./usehttp";
import { createPinia } from 'pinia';
import { loadFonts } from "./webfontloader";
import { loadModules } from "./moduleloader";
import cookies from "@/helpers/cookies";
/**
 * Set default global http configuration
 */
axios.defaults.timeout = 20000;
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Content-Type'] = "application/json";
axios.defaults.headers.common['X-Client-Locale'] = i18n.global.locale.value;
axios.interceptors.request.use(
  function (config) {
    let token = cookies.get("token");
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
/**
 * Register app plugins
 */
export async function registerPlugins(app) {
  await loadFonts();

  const pinia = createPinia();
  app.use(pinia);

  const store = useStore();
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$store = store;

  const moduleLoader = await loadModules(app);
  const resources = await moduleLoader.install(app, i18n, store, pinia);
  app.config.globalProperties.$resources = resources;

  // Global plugins
  app.use(vuetify).use(i18n);
  useHttp(axios, store); // global http instance
  app.config.globalProperties.$vuetify = vuetify;

  // Register plugin loaders
  await loader.install(app);

  // Register install admin & modules
  await admin.install(app, { i18n, store, http: axios });

  await moduleLoader.registerStores();
  moduleLoader.registerComponents();
  moduleLoader.registerResourceComponents();

  // Router must be defined at the bottom !!
  //
  // https://stackoverflow.com/questions/78844518/vue-router-gives-a-warning-when-adding-dynamic-route-no-match-found-for-locatio
  // 
  app.use(router);
}