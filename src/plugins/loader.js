/**
 * @oloma.dev (c) 2023-2025
 *
 * - plugins/loader.js
 * 
 * automatically load resources and external libs
 */
import PortalVue from "portal-vue";
import UnsavedFormDialog from "../components/UnsavedFormDialog.vue";
import PageNotFound from "@/views/Error404.vue";

/**
 * Dynamic vuetify components
 */
import {
  VAutocomplete,
  VCombobox,
} from "vuetify/components";

export default {
  install: async (app) => {
    /**
     * Register portal-vue
     */
    app.use(PortalVue);
    /**
     * 404 Not found component
     */
    app.component("PageNotFound", PageNotFound);
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
     * Load all module loaders dynamically
     */
    // for (const path in modules) {
    //   const module = await modules[path]();
    //   app.use(module.default);
    // }
    // end app resources
  },
};
