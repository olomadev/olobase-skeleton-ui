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
import useStore from "../store";
import resources from "@/modules/resources";
import { useHttp } from "../plugins/use-http";
import { camelCase, upperFirst } from "lodash";
import cookies from "olobase-admin/src/utils/cookies";
/**
 * Get cookie constants object
 */
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);
/**
 * Create Pinia instance
 */
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
//
// Loading of each components, repositories and plugins for each module
// 
const components = import.meta.glob("../modules/**/components/*.vue", { eager: true });
const stores = import.meta.glob("../modules/**/store.js", { eager: true });
const moduleResources = import.meta.glob('../modules/**/resources/*/*.vue', { eager: true })
const moduleResourceIndexes = import.meta.glob('../modules/**/resources/index.js', { eager: true });
const mergedResources = [...resources, ...moduleResourceIndexes];
/**
 * Main register function
 */
export async function registerPlugins(app) {
  loadFonts();

  // Register plugin loaders
  loader.install(app);

  // Global plugins
  app
    .use(pinia)
    .use(vuetify)
    .use(i18n);
  const store = useStore();
  useHttp(axios, store); // global http instance
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$vuetify = vuetify;
  admin.install(app, store, axios, mergedResources);

  // Register components
  for (const path in components) {
    const name = path.split("/").pop().replace(".vue", "");
    app.component(name, components[path].default);
  }

  // Register resources automatically for each module
  for (let fileName in moduleResources) {
    const componentConfig = moduleResources[fileName];
    fileName = fileName
      .replace(/^\.\//, "")
      .replace(/\//, "")
      .replace(/\.\w+$/, "");
    const pathArray = fileName.split("/").slice(-2);
    const componentName = upperFirst(camelCase(pathArray[0].toLowerCase() + pathArray[1]));

    // register resource component
    app.component(
      componentName,
      componentConfig.default || componentConfig
    );
  }

  // Register pinia stores
  for (const path in stores) {
    pinia.use(stores[path].default);
  }
  //
  // Router must be defined at the bottom !!
  //
  // https://stackoverflow.com/questions/78844518/vue-router-gives-a-warning-when-adding-dynamic-route-no-match-found-for-locatio
  // 
  app.use(router);
}
