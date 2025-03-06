/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/admin.js
 *
 * https://oloma.dev/end-user-license-agreement
 * 
 * bootstraps admin and other plugins then mounts the App
 */
import OlobaseAdmin from "olobase-admin";
import router from "@/router";
import config from "@/_config";
import routes from "@/router/admin";
import PageNotFound from "@/views/Error404.vue";
import {
  jsonServerDataProvider,
  jwtAuthProvider,
} from "olobase-admin/src/providers";
import { en, tr } from "olobase-admin/src/locales";
import ModuleLoader from "./module-loader";

// How to write a plugin for vue 3 !
// @see
// https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin

let admin = new OlobaseAdmin(import.meta.env);
/**
 * Install admin plugin
 */
export default {
  async install(app, { i18n, pinia, store, http }) {

      // Create module loader instance
    const moduleLoader = new ModuleLoader();
    await moduleLoader.install(app, i18n, store, pinia);
    const resources = moduleLoader.getResources();

    // console.error(app.config.globalProperties)
    admin.setOptions({
      app,
      router,
      resources,
      store,
      i18n,
      downloadUrl: "/files/findOneById/",
      readFileUrl: "/files/readOneById/",
      title: "demo",
      routes,
      locales: { en, tr },
      dataProvider: jsonServerDataProvider(http),
      authProvider: jwtAuthProvider(http),
      http,
      canAction: null,
      // canAction: ({ resource, action, can }) => {
      //   if (can(["admin"])) {
      //     return true;
      //   }
      //   // any other custom actions on given resource and action...
      // },
      config,
    });
    admin.init();
    OlobaseAdmin.install(app); // install layouts & components
    app.provide("i18n", i18n);
    app.config.globalProperties.$admin = admin;
    app.component("PageNotFound", PageNotFound);

    // Register components automatically for each module
    await moduleLoader.registerStores();
    moduleLoader.registerComponents();
    moduleLoader.registerResourceComponents();

  },
};
