/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/loader.js
 * 
 * automatically loaed resources and external libs
 */
import "./vuetify";
import "@mdi/font/css/materialdesignicons.css";
import PortalVue from "portal-vue";
import UnsavedFormDialog from "../components/UnsavedFormDialog";
import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";
/**
 * Autoload resources
 */
const resources = import.meta.glob('@/resources/*/*.vue', { eager: true })
/**
 * Dynamic vuetify components
 */
import {
  VAutocomplete,
  VCombobox,
} from "vuetify/components";

export default {
  install: (app) => {
    /**
     * Register portal-vue
     */
    app.use(PortalVue);
    /**
     * Register global modal
     */
    app.component('UnsavedFormDialog', UnsavedFormDialog);
    /**
     * Explicit registering of this components because dynamic
     */
    app.component("VAutocomplete", VAutocomplete);
    app.component("VCombobox", VCombobox);
    /**
     * Register application resources automatically
     */
    for (let fileName in resources) {
      const componentConfig = resources[fileName];
      fileName = fileName
        .replace(/^\.\//, "")
        .replace(/\//, "")
        .replace(/\.\w+$/, "");
      const pathArray = fileName.split("/").slice(-2);
      const componentName = upperFirst(camelCase(pathArray[0].toLowerCase() + pathArray[1]));

      // register component
      app.component(
        componentName,
        componentConfig.default || componentConfig
      );
    }
    // end app resources
  },
};
