/**
 * @oloma.dev (c) 2023-2024
 *
 * - plugins/loader.js
 * 
 * automatically loaed resources and external libs
 */
import "./vuetify";
import Trix from "trix";
import "trix/dist/trix.css";
import "@mdi/font/css/materialdesignicons.css";
import PortalVue from "portal-vue";
import NoExitWihoutSaveModal from "../components/NoExitWihoutSaveModal";
import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";
/**
 * Autoload resources
 */
const modules = import.meta.glob('@/resources/*/*.vue', { eager: true })
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
    app.component('formSaveModal', NoExitWihoutSaveModal);
    /**
     * Explicit registering of this components because dynamic
     */
    app.component("VAutocomplete", VAutocomplete);
    app.component("VCombobox", VCombobox);
    /**
     * Register application resources automatically
     */
    for (let fileName in modules) {
      const componentConfig = modules[fileName];
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
