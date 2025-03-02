/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/module-loader.js
 * 
 * module loader
 */
import { defineAsyncComponent } from "vue";
import { camelCase, upperFirst } from "lodash";
import globalResources from "@/modules/resources";

export default class ModuleLoader {

  /**
   * Installs module loader plugin.
   */
  async install(app, pinia) {
    this.app = app;
    this.pinia = pinia;
    // 
    // Loading of each "components", "stores" and "resources" for each module
    // 
    this.components = import.meta.glob("../modules/**/components/*.vue", { eager: false });
    this.stores = import.meta.glob("../modules/**/store.js", { eager: false });
    this.moduleResources = import.meta.glob('../modules/**/resources/*/*.vue', { eager: false });
    this.moduleResourceIndexes = import.meta.glob('../modules/**/resources/index.js', { eager: true }); // top level resources must be eager
    this.formattedModules = this.formatResources();
  }

  getResources() {
    return [...globalResources, ...this.formattedModules];
  }

  /**
   * Converts resources to the appropriate format.
   */
  formatResources() {
    return Object.entries(this.moduleResourceIndexes).map(([path, { default: resources }]) => {
      const moduleName = path.split('/')[2]; // get module name
      return resources.map(resource => ({
        ...resource,
        name: `${moduleName.toLowerCase()}_${resource.name}`, // resource name new format  module + "_" + resource_name
        module: moduleName,
      }));
    }).flat();
  }

  /**
   * Dynamically registers components in the Vue application.
   */
  registerComponents() {
    for (const path in this.components) {
      const name = path.split("/").pop().replace(".vue", "");
      this.app.component(name, defineAsyncComponent(() => this.components[path]()));
    }
  }

  /**
   * Dynamically registers source components in the Vue application.
   */
  registerResourceComponents() {
    for (let fileName in this.moduleResources) {
      const componentConfig = this.moduleResources[fileName];

      fileName = fileName.replace(/^\.\//, "");
      const pathArray = fileName.split("/");

      const moduleName = pathArray[2]; // ModuleName
      const resourceName = pathArray[4]; // ResourceName
      const action = pathArray[5].replace(/\.\w+$/, ""); // Action without file extension

      // Combine to form the new component name (ModuleName/ResourceName/Action)
      const componentName = `${upperFirst(camelCase(moduleName))}${upperFirst(camelCase(resourceName))}${upperFirst(camelCase(action))}`;

      this.app.component(
        componentName,
        defineAsyncComponent(() => componentConfig())
      );
    }
  }

  /**
   * Register pinia stores for each module
   */
  registerStores() {
    for (const path in this.stores) {
      this.pinia.use(this.stores[path].default);
    }
  }

}
