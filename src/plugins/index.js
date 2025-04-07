/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/index.js
 * 
 * automatically included in `./src/main.js`
 */
import router from "../router";
import admin from "./admin";
import loader from "./loader";
import useStore from "../store";
import { useHttp } from "./usehttp";
import { createPinia } from 'pinia';
import i18n from "@/modules/i18n/src/plugin";
import vuetify from "@/modules/i18n/src/plugin/vuetify";
import { loadFonts } from "./webfontloader";
import { loadModules, ModuleLoader } from "./moduleloader";
import axios from "@/helpers/axios";

// Register default locale for backend api
axios.defaults.headers.common['X-Client-Locale'] = i18n.global.locale.value;

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
  app.config.globalProperties.$pinia = pinia;
  app.config.globalProperties.$vuetify = vuetify;

  const modules = await loadModules(app);
  const moduleLoader = new ModuleLoader(modules);
  const resources = await moduleLoader.install(app);

  app.use(i18n);
  app.use(vuetify);
  app.provide('i18n', i18n);
  app.config.globalProperties.$resources = resources;
  useHttp(axios, store); // global http instance

  // Register plugin loaders
  await loader.install(app);

  await moduleLoader.registerStores();
  moduleLoader.registerComponents();
  moduleLoader.registerResourceComponents();

  // Register install admin & modules
  await admin.install(app, { i18n, store, http: axios });

  // Router must be defined at the bottom !!
  //
  // https://stackoverflow.com/questions/78844518/vue-router-gives-a-warning-when-adding-dynamic-route-no-match-found-for-locatio
  // 
  app.use(router);
}