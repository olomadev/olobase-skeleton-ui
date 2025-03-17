export default {
  // 
  // view settings
  // 
  density: "compact",
  //
  // va-form component global settings
  // 
  form: {
    disableGenerateUid: false, // if this option is "true" the application will generate integer IDs.
    disableUnsavedFormDialog: false,
  },
  i18n: {
    defaultLocale: "en",
    fallbackLocale: "en",
    locales: ["en", "tr"], // supported locales
    dateFormat: "shortFormat",
    en: {
      dateFormat: "Y-m-d", // Y.m.d, Y\m\d or Y/m/d
      dateTimeFormat: "Y-m-d H:i:s",
    },
    tr: {
      dateFormat: "d-m-Y",
      dateTimeFormat: "d-m-Y H:i:s",
    },
  },
  //
  // va-list provider global settings
  // 
  list: {
    hideHeader: false,
    itemsPerPage: 10,
    itemsPerPageOptions: [10,20,50,100,200,-1],
    disableSettings: false,
    disableGlobalSearch: false,
    disableItemsPerPage: false,
  },
  //
  // va-messages layout global settings
  // 
  snackbar: {
    error: {
      class: "mt-10 slide-in",
      color: "error",
      icon: "mdi-close-circle",
      location: "top",
      variant: "elevated",
      rounded: true,
      timeout: 7500,
      title: false, // "va.messages.error",
      visible: true 
    },
    info: {
      class: "mt-10 slide-in",
      color: "blue",
      icon: "mdi-information",
      location: "top",
      variant: "elevated",
      rounded: true,
      timeout: 7500,
      title: false, // "va.messages.info",
      visible: true
    },
    success: {
      class: "mt-10 slide-in",
      color: "success",
      icon: "mdi-checkbox-marked-circle",
      location: "top",
      variant: "elevated",
      rounded: true,
      timeout: 7500,
      title: false, // "va.messages.success",
      visible: true
    },
    warning: {
      class: "mt-10 slide-in",
      color: "warning",
      icon: "mdi-alert-circle",
      location: "top",
      variant: "elevated",
      rounded: true,
      timeout: 7500,
      title: false, // "va.messages.warning",
      visible: true
    }
  },
};