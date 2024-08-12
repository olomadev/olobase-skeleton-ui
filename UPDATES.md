
## 2.x Updates

* dereacted usage of this.admin instead of use this.$admin // app.config.globalProperties.$admin = admin;
 - admin/layouts/Messages.vue line 61..

* mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth();

* SheetInput.vue component mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth();

* views/Login.vue
* views/Account.vue
* views/Password.vue
* components/layouts/Admin.vue
* components/layout/AppBar.vue
* components/layout/Footer.vue
* admin/components/ui/buttons/DeleteButton.vue
* components/NoExitWithoutSaveModal.vue
    - mapActions().login() changed as await this.$store.getModule("auth").login();
    - mapActions().checkAuth() changed as await this.$store.getModule("auth").checkAuth();
    - this.$store.dispatch("auth/logout") changed as this.$store.getModule("auth").logout();


* providers/auth/jwt.js
* providers/auth/actions.js

* mixins/resource.js  (currentResource() relaced this.admin as this.$admin)

* store/api.js
* store/auth.js
* store/guest.js
* store/messages.js
* store/resource.js

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