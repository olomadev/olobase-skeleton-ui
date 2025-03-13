/*!
 * Oloma Dev.
 * 
 * [olobase-admin] <https://github.com/olomadev/olobase-admin>
 *
 * Copyright (c) 2022-2025, Oloma Software.
 *
 * https://oloma.dev/end-user-license-agreement
 */
/**
 * Dynamic import only for layout and ui components
 */
async function registerComponents(app) {
  const modules = import.meta.glob([
    './components/layout/**/*.vue',
    './components/ui/**/*.vue'
  ]);
  for (const path in modules) {
    const component = await modules[path]();
    const name = path
      .split('/')
      .pop()
      .replace(/\.\w+$/, ''); // Dosya adını bileşen adı olarak kullan

    app.component(`Va${name}`, component.default);
  }
}
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
Olobase.install = async (app) => {
  /**
   * Register Admin UI components
   */
  await registerComponents(app);
  // /**
  //  * Inject global admin conf
  //  */
  // app.mixin({
  //   beforeCreate() {
  //     this.$admin = this.$root.$options.admin
  //   }
  // })
}
