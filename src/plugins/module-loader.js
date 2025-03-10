import { defineAsyncComponent } from "vue";
import { camelCase, upperFirst, merge } from "lodash";
import globalModuleConfigs from "@/modules/config";
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
   * Installs the module loader plugin.
   */
  async install(app, i18nInstance, defaultStore, pinia) {
    this.app = app;
    this.pinia = pinia;

    for (const [moduleName, loader] of Object.entries(globalModuleConfigs)) {
      const module = await loader();

      if (module.default.install) {
        const { i18n, routes, stores, components, navigation, resources, resourceComponents } =
          await module.default.install(app);

        // **Add i18n Messages**
        if (i18n && i18n.messages) {
          Object.keys(i18n.messages).forEach((lang) => {
            i18nInstance.global.mergeLocaleMessage(lang, i18n.messages[lang]);
          });
        }

        // **Store Navigations**
        if (typeof navigation.build === "function") {
          defaultStore.navigations.push(navigation);
        } else {
          console.error(`Invalid navigation function in module ${moduleName}`);
        }

        // **Load Routes**
        if (routes && Array.isArray(routes)) {
          this.routes.push(...routes);
        }

        // **Load Stores**
        if (stores && Array.isArray(stores)) {
          this.stores.push(...stores);
        }

        // **Load Components**
        if (components && typeof components === "object") {
          Object.assign(this.components, components);
        }

        // **Load Resources**
        if (resources && Array.isArray(resources)) {
          const resourcesWithModule = resources.map((resource) => ({
            ...resource,
            module: moduleName,
            name: resource.standalone
              ? resource.name.toLowerCase()
              : `${moduleName.toLowerCase()}_${resource.name}`,
          }));
          this.resources.push(...resourcesWithModule);
        }

        // **Load Resource Components**
        if (resourceComponents) {
          Object.assign(this.resourceComponents, resourceComponents);
        }
      }
    }

    // **Add Dynamic Routes to Router**
    this.routes.forEach((route) => router.addRoute(route));
  }

  /**
   * Returns to all resources for olobase admin plugin
   */
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
   * Dynamically registers resource components in the Vue application.
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
   * Registers Pinia stores for each module.
   */
  async registerStores() {
    for (const path in this.stores) {
      try {
        const store = await this.stores[path]();
        this.pinia.use(store.default);
      } catch (error) {
        console.error(`Store loading failed for ${path}:`, error);
      }
    }
  }
}
