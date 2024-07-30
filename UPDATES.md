
## 2.x Updates

* dereacted usage of this.admin instead of use this.$admin // app.config.globalProperties.$admin = admin;
 - admin/layouts/Messages.vue line 61..

* mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth();

* plugins/index.js ( added pinia )

* i18n/translation.js  line 25
    store.setLocale(newLocale);

* Layouts/Admin.vue
    computed functions
    getEmail(), getAvatar(), getFullname(), getCurrentLocale(), avatarExists()
    methods
    ...mapActions({
      checkAuth: "auth/checkAuth",
    }),
    logout(),