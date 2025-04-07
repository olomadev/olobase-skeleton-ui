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
import config from "@/@config";
import routes from "@/router/admin";
import {
  jsonServerDataProvider,
  jwtAuthProvider,
} from "olobase-admin/src/providers";

// How to write a plugin for vue 3 !
// @see
// https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin

let admin = new OlobaseAdmin(import.meta.env);
/**
 * Install admin plugin
 */
export default {
  async install(app, { i18n, store, http }) {
    const resources = app.config.globalProperties.$resources;    
    // console.error(app.config.globalProperties)
    admin.setOptions({
      app,
      router,
      resources,
      store,
      i18n,
      downloadUrl: "/files/findOneById/",
      readFileUrl: "/files/readOneById/",
      routes,
      locales: {  },
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
    OlobaseAdmin.install(app); // install layouts & components
    admin.init();
    app.config.globalProperties.$admin = admin;
  },
};
