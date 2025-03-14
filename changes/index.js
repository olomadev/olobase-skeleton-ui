/*!
 * Oloma Dev.
 * 
 * [olobase-admin] <https://github.com/olomadev/olobase-admin>
 *
 * Copyright (c) 2022-2025, Oloma Software.
 *
 * https://oloma.dev/end-user-license-agreement
 */
import * as layouts from "./components/layout";
import * as ui from "./components/ui";
/**
 * Main JS App
 */
import Olobase from "olobase-admin/src/olobase"
/**
 * Main admin entry
 */
export default Olobase;
/**
 * Set environment variables
 */
new Olobase(import.meta);
/**
 * Vue install plugin
 */
Olobase.install = (app) => {
  /**
   * Register Admin UI components
   */
  [layouts, ui].forEach((c) => {
    Object.keys(c).forEach((name) => {
      app.component(`Va${name}`, c[name])
    })
  })
  // /**
  //  * Inject global admin conf
  //  */
  // app.mixin({
  //   beforeCreate() {
  //     this.$admin = this.$root.$options.admin
  //   }
  // })
}
