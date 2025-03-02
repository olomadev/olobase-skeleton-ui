/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/index.js
 * 
 * automatically included in `./src/main.js`
 */
import axios from "axios";
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import i18n from "../i18n";
import admin from "./admin";
import loader from "./loader";
import ModuleLoader from "./module-loader";
import useStore from "../store";
import { useHttp } from "../plugins/use-http";
import { camelCase, upperFirst } from "lodash";
import { createPinia } from 'pinia';
import cookies from "olobase-admin/src/utils/cookies";
/**
 * Get cookie constants object
 */
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);
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
/**
 * Register app plugins
 */
export async function registerPlugins(app) {
  loadFonts();

  const pinia = createPinia(); // must be at the top level
  app.use(pinia); // must be at the top level

  // Create module loader instance
  const moduleLoader = new ModuleLoader();

  // Register plugin loaders
  await loader.install(app);
  await moduleLoader.install(app, pinia);

  // Global plugins
  app.use(vuetify).use(i18n);

  const store = useStore();
  useHttp(axios, store); // global http instance
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$vuetify = vuetify;
  
  // Register olobase admin plugin
  admin.install(app, store, axios, moduleLoader.getResources());

  // Register resources automatically for each module
  moduleLoader.registerComponents();
  moduleLoader.registerResourceComponents();
  moduleLoader.registerStores();

  // Router must be defined at the bottom !!
  //
  // https://stackoverflow.com/questions/78844518/vue-router-gives-a-warning-when-adding-dynamic-route-no-match-found-for-locatio
  // 
  app.use(router);
}