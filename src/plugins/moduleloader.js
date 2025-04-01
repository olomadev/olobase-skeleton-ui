/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/moduleloader.js
 * 
 * load application modules dynamically using backend api
 */
import { defineAsyncComponent } from "vue";
import { capitalize, camelCase, upperFirst } from '@/helpers/lodash';
import router from "@/router";
import i18nInstance from "@/modules/i18n/src/plugin";

class ModuleLoader {

  constructor(modules) {
    this.modules = modules;
    this.moduleCache = {};
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
  async install(app) {
    this.app = app;
    this.pinia = app.config.globalProperties.$pinia;
    const defaultStore = app.config.globalProperties.$store;

    const moduleInstances = await Promise.all(this.modules.map(m => this.loadModule(m)));

    for (const [index, moduleInstance] of moduleInstances.entries()) {
      const module = this.modules[index];
      if (moduleInstance.default.install) {
        const { i18n, routes, stores, components, navigation, resources, resourceComponents } =
          await moduleInstance.default.install(app);

        // **Merge i18n Messages**
        if (i18n?.messages) {
          for (const lang in i18n.messages) {
            i18nInstance.global.mergeLocaleMessage(lang, i18n.messages[lang]);
          }
        }

        // **Store Navigations**
        if (navigation && typeof navigation.build === "function") {
          defaultStore.navigations.push(navigation);
        }

        // **Load Routes**
        if (routes && typeof routes.build === "function") {
          this.routes.push(...routes.build());
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
            module: module.name,
            name: resource.standalone
              ? resource.name.toLowerCase()
              : `${module.name.toLowerCase()}_${resource.name}`,
          }));
          this.resources.push(...resourcesWithModule);
        }

        // **Load Resource Components**
        if (resourceComponents) {
          Object.assign(this.resourceComponents, resourceComponents);
        }

      } // module is installed end

    } // end for

    // **Add Dynamic Routes to Router**
    this.routes.forEach((route) => router.addRoute(route));

    return this.getResources();
  }

  getI18nInstance() {
    return this.i18nInstance;
  }

  /**
   * Dynamic module loading function.
   */
  async loadModule(module) {
    try {
      const moduleName = module.name;
      if (this.moduleCache[moduleName]) {
        return this.moduleCache[moduleName];
      }
      let moduleInstance = null;
      moduleInstance = await import(`@/modules/${moduleName}/src/index.js`);  
      if (moduleInstance.version && this.isVersionOlder(moduleInstance.version, module.version)) {
        console.log(`New version available: ${moduleName} - ${module.version}`);
      }
      this.moduleCache[moduleName] = moduleInstance;
      return moduleInstance;
    } catch (error) {
      console.error(`Failed to load module: ${module.name}`, error);
      return null;
    }
  }

  /**
   * Returns to all resources for olobase admin plugin
   */
  getResources() {
    return [...this.resources];
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
    for (const storeFn of this.stores) {
      try {
        const store = await storeFn();
        this.pinia.use(store.default);
      } catch (error) {
        console.error(`Store loading failed:`, error);
      }
    }
  }

  /**
   * Check module version is older
   */
  isVersionOlder(current, target) {
    const currentParts = current.split('.').map(Number);
    const targetParts = target.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((currentParts[i] || 0) < (targetParts[i] || 0)) return true;
      if ((currentParts[i] || 0) > (targetParts[i] || 0)) return false;
    }
    return false;
  }

}

/**
 * Loade modules - create db request for active modules
 */
async function loadModules(app) {
  const axios = app.config.globalProperties.$axios;
  const response = await axios.get("/modules/findAll");
  if (!response || response.status !== 200) {
    console.error('Modules could not be loaded. Error:', response ? response.status : 'No response');
    return;
  }
  return response.data.data;
}

export { ModuleLoader, loadModules }