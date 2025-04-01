export default  {
 density: "compact",
  form: {
    disableGenerateUid: false,
    disableUnsavedFormDialog: false,
  },
  list: {
    hideHeader: false,
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 20, 50, 100, 200, -1],
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
      title: false, // "i18n.messages.error",
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
      title: false, // "i18n.messages.info",
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
      title: false, // "i18n.messages.success",
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
      title: false, // "i18n.messages.warning",
      visible: true
    }
  }
}