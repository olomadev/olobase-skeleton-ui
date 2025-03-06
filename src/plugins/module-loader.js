/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/module-loader.js
 * 
 * module loader
 */
import { defineAsyncComponent } from "vue";
import { camelCase, upperFirst } from "lodash";
import moduleConfigs from "@/modules/config";
import globalResources from "@/modules/resources";
import router from "@/router";

export default class ModuleLoader {

  constructor() {
    this.routes = [];
    this.stores = [];
    this.resources = [];
    this.navigations = [];
    this.resourceComponents = {};
    this.components = {};
  }

  /**
   * Installs module loader plugin.
   */
  async install(app, i18nInstance, defaultStore, pinia) {
    this.app = app;
    this.pinia = pinia;

    // Install all modules
    let messages = {};
    for (const [moduleName, loader] of Object.entries(moduleConfigs)) {
      const module = await loader();
      if (module.default.install) {
        const { i18n, routes, stores, components, navigation, resources, resourceComponents } = await module.default.install(app);

        if (i18n && i18n['messages']) { // add i18n messages to Vue I18n
          Object.keys(i18n['messages']).forEach((lang) => {
            i18nInstance.global.mergeLocaleMessage(lang, i18n['messages'][lang]);
          });
        }
        if (typeof navigation.build === 'function') { // build navigation array
          defaultStore.navigations.push(navigation)
        } else {
          console.error(`Invalid navigation function in module ${moduleName}`);
        }
        if (routes && Array.isArray(routes)) {
          this.routes.push(...routes);
        }
        if (stores && Array.isArray(stores)) {
          this.stores.push(...stores);
        }
        if (components && typeof components === 'object') {
          Object.assign(this.components, components);
        }
        if (resources && Array.isArray(resources)) {
          const resourcesWithModule = resources.map(resource => ({
            ...resource,
            module: moduleName,
            name: resource['standalone'] ? resource.name.toLowerCase() : `${moduleName.toLowerCase()}_${resource.name}`,
          }));
          this.resources.push(...resourcesWithModule);
        }
        if (resourceComponents) {
          Object.assign(this.resourceComponents, resourceComponents);
        }
      }
    }
    //
    // add dynamic module routes to router
    this.routes.forEach(route => router.addRoute(route));
  }

  getResources() {
    return [...globalResources, ...this.resources];
  }

  /**
   * Dynamically registers components in the Vue application.
   */
  registerComponents() {
    for (const [key, componentConfig] of Object.entries(this.components)) {
      const componentName = upperFirst(camelCase(key));
      this.app.component(
        componentName,
        defineAsyncComponent(() => componentConfig())
      );
    }
  }

  /**
   * Dynamically registers source components in the Vue application.
   */
  registerResourceComponents() {
    for (const [key, componentConfig] of Object.entries(this.resourceComponents)) {
      const componentName = upperFirst(camelCase(key));
      this.app.component(
        componentName,
        defineAsyncComponent(() => componentConfig())
      );
    }
  }

  /**
   * Register pinia stores for each module
   */
  async registerStores() {
    for (const path in this.stores) {
      try {
        const store = await this.stores[path]();  // load store dynmacially
        this.pinia.use(store.default);  // add the loaded Store to Pinia
      } catch (error) {
        console.error(`Store loading failed for ${path}:`, error);
      }
    }
  }

}
