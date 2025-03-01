
Wordpress benzeri olobase-skeleton-ui adındaki vue 3 ve vuetify ile yapılmış projemde aşağıdaki bir dizin yapım var. Yapmak istediğim şey bu projeyi modüler hale getirmek. Bunun için aşağıdakileri uygulamam gerekli.

1- "resources" yapısını kullanarak bozmadan her modülünün rotaları (routes) ile beraber bu dizin içerisinde bağımsız çalışabileceği bir yapı oluşturmak.
2- Her modülün bağımsız i18 dosyaları olabilmeli.
3- Her modülün bağımsız layouts/ dosyaları olabilmeli.
4- Her modülün bağımsız components/ dosyaları olabilmeli.
5- Her modülün bağımsız plugins/ dosyaları olabilmeli.
6- Her modülün bağımsız views/ dosyaları olabilmeli.
7- Her modülün bağımsız store/ dosyaları olabilmeli. Pinia kullanıyorum.
8- Her modülün bağımsız \_nav.js/ dosyaları olabilmeli.
9- npm run build yapıldığında her modülün dosyaları dist/ klasörüne bağımsız export edilemeli.
10- dist/ klasörü içerisine bir modül sonradan dahil edildiğinde uygulama çalışabilmeli.

```sh
├── node-modules
├── public
├── src
│   ├── components
│   ├── i18n
│   │   ├── locales
│   │   │   ├── en.js
│   │   │   ├── tr.js
│   ├── index.js
│   ├── layouts
│   │   ├── Admin.vue
│   │   ├── Member.vue
│   ├── plugins
│   │   ├── admin.js
│   │   ├── index.js
│   │   ├── loader.js
│   │   ├── use-http.js
│   │   ├── vuetify.js
│   ├── resources
│   │   ├── Permissions
│   │   │   ├── List.vue
│   │   ├── Roles
│   │   │   ├── Create.vue
│   │   │   ├── Edit.vue
│   │   │   ├── Form.vue
│   │   │   ├── List.vue
│   │   ├── Users
│   │   ├── index.js
│   ├── router
│   │   ├── admin.js
│   │   ├── index.js
│   ├── store
│   │   ├── index.js
│   ├── styles
│   │   ├── settings.scss
│   ├── App.vue
│   ├── views
│   │   ├── Account.vue
│   │   ├── Dashboard.vue
│   │   ├── Login.vue
│   │   ├── ForgotPassword.vue
│   │   ├── Error404.vue
│   ├── main.js
│   │   │
│   ├── package.json
│   ├── vite.config.js
```

resources\index.js
--------------------------

```js
export default [
  {
    name: "users",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "roles",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "permissions",
    label: "name",
    permissions: [
      { name: "admin", actions: ["create","list","edit", "delete", "show"] },
    ],
    actions: ["create", "list", "edit", "delete", "show"],
  },
  {
    name: "locales",
    label: "name",
  },
  {
    name: "currencies",
    label: "name",
  },
  {
    name: "countries",
    label: "name",
  },
];
```

main.js
--------------------------
```js
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
// import './assets/css/style.css'; // Tailwind and other styles, put here

// Plugins
import { registerPlugins } from "@/plugins";
const app = createApp(App);

async function init() {
  await registerPlugins(app);
  app.mount("#app");
}
init()
```

App.vue
--------------------------

```
<template>
  <router-view></router-view>
  <unsaved-form-dialog></unsaved-form-dialog>
</template>
```

_nav.js
--------------------------

```js
export default  {

  build: async function(t, admin) {

    const userRole = await admin.can(["user"]);
    const adminRole = await admin.can(["admin"]);

    return [
      {
        icon: "mdi-view-dashboard-outline",
        text: t("menu.dashboard"),
        link: "/dashboard",
      },
      // { divider: true },
      {
        icon: "mdi-account-multiple",
        text: t("menu.roles"),
        link: "/roles",
      },
      {
        icon: "mdi-account-lock",
        text: t("menu.permissions"),
        link: "/permissions",
      },
      {
        icon: "mdi-account-edit",
        text: t("menu.users"),
        link: "/users?sortBy=firstname&sortDesc=false",
      },
    ]; // end array

  } // end func

} // end class
```

_config.js
--------------------------

```js
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
};
```


plugins/index.js
------------------------------

```js
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import i18n from "../i18n";
import admin from "./admin";
import loader from "./loader";
import useStore from "../store";
import resources from "@/resources";
import { useHttp } from "../plugins/use-http";
import axios from "axios";
import cookies from "olobase-admin/src/utils/cookies";
/**
 * Get cookie constants object
 */
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);
import { createPinia } from 'pinia';
const pinia = createPinia();
/**
 * Set default global http configuration
 */
axios.defaults.timeout = 20000;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = "application/json";
axios.defaults.headers.common['X-Client-Locale'] = i18n.global.locale.value;
axios.interceptors.request.use(
  function (config) {
    let token = cookies.get(cookieKey.token);
    if (typeof token == "undefined" || token == "undefined" || token == "") {
      return config;
    }
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * Main register function
 */
export async function registerPlugins(app) {
  loadFonts();
  loader.install(app);
  app
    .use(pinia)
    .use(vuetify)
    .use(i18n);
  const store = useStore();
  useHttp(axios, store); // global http instance
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$vuetify = vuetify;
  admin.install(app, store, axios, resources);
  //
  // Router must be defined at the bottom !!
  //
  // https://stackoverflow.com/questions/78844518/vue-router-gives-a-warning-when-adding-dynamic-route-no-match-found-for-locatio
  // 
  app.use(router);
}
```

plugins/admin.js
--------------------------------------

```js
import OlobaseAdmin from "olobase-admin";
import router from "@/router";
import i18n from "../i18n";
import config from "@/_config";
import routes from "@/router/admin";
import PageNotFound from "@/views/Error404.vue";
import {
  jsonServerDataProvider,
  jwtAuthProvider,
} from "olobase-admin/src/providers";
import { en, tr } from "olobase-admin/src/locales";


let admin = new OlobaseAdmin(import.meta.env);
/**
 * Install admin plugin
 */
export default {
  install: (app, store, http, resources) => {
    // console.error(app.config.globalProperties)
    admin.setOptions({
      app,
      router,
      resources,
      store,
      i18n,
      downloadUrl: "/files/findOneById/",
      readFileUrl: "/files/readOneById/",
      title: "demo",
      routes,
      locales: { en, tr },
      dataProvider: jsonServerDataProvider(http),
      authProvider: jwtAuthProvider(http),
      http,
      canAction: null,
      // canAction: ({ resource, action, can }) => {
      //   if (can(["admin"])) {
      //     return true;
      //   }
      //   // any other custom actions on given resource and action...
      // },
      config: config,
    });
    admin.init();
    OlobaseAdmin.install(app); // install layouts & components
    app.provide("i18n", i18n);
    app.config.globalProperties.$admin = admin;
    app.component("PageNotFound", PageNotFound);
  },
};
```


olobase-admin.js
-------------------------------------------

```js
import upperFirst from "lodash/upperFirst"
import lowerCase from "lodash/lowerCase"
import isEmpty from "lodash/isEmpty"
import cookies from "olobase-admin/src/utils/cookies"
import messages from "olobase-admin/src/store/messages"
import auth from "olobase-admin/src/store/auth"
import guest from "olobase-admin/src/store/guest"
import api from "olobase-admin/src/store/api"
import storeResource from "olobase-admin/src/store/resource"
import routeResource from "olobase-admin/src/router/resource"

export default class Olobase {

  constructor(env) {
    this.env = env
  }

  setOptions({
    app,
    router,
    resources,
    store,
    i18n,
    downloadUrl,
    readFileUrl,
    title,
    routes,
    locales,
    authProvider,
    dataProvider,
    config,
    canAction,
    http
  }) {
    if (typeof this.env.VITE_SUPPORTED_LOCALES == "undefined") {
      throw new Error("Configuration error: .env.local or .env.prod environment file missed in your project !");
    }
    const supportedLocales = this.env.VITE_SUPPORTED_LOCALES;
    let translations = [];
    if (supportedLocales 
      && Object.prototype.toString.call(supportedLocales) === "[object String]") 
    {
      const split = supportedLocales.split(",");
      if (Array.isArray(split)) {
        translations = split;
      }
    }
    this.cookieKey = JSON.parse(this.env.VITE_COOKIE);
    /**
     * Options properties
     */
    this.app = app
    this.router = router
    this.store = store
    this.i18n = i18n
    this.apiUrl = this.env.VITE_API_URL
    this.downloadUrl = downloadUrl
    this.readFileUrl = readFileUrl
    this.title = title
    this.routes = routes
    this.locales = locales
    this.translations = translations
    this.authProvider = authProvider
    this.dataProvider = dataProvider
    this.config = config || {}
    this.canAction = canAction
    this.http = http
    this.saved = false // global form saved object

    if (resources) {
      this.setResources(resources);
    }
  }

  setResources(resources) {

    this.resources = resources
      .map((r) => {
        return typeof r === "string"
          ? {
              name: r,
            }
          : r;
      })
      .map((r) => {
        /**
         * Get valid routes
         */
        let routes = ["list", "show", "create", "edit"].filter((name) => {
          return !r.routes || r.routes.includes(name)
        })

        /**
         * Get valid actions
         */
        let actions = ["list", "show", "create", "edit", "delete"].filter(
          (name) => {
            if ((r.actions || []).length) {
              return r.actions.includes(name)
            }
            if ((r.except || []).length) {
              return !r.except.includes(name)
            }
            return true
          }
        );
        let nameKey = `resources.${r.name}.name`
        let getName = (count) =>
          this.i18n.global.te(nameKey)
            ? this.i18n.global.tc(nameKey, count)
            : upperFirst(lowerCase(r.name))

        return {
          ...r,
          icon: r.icon || "mdi-view-grid",
          routes,
          actions,
          getName,
          singularName: getName(1),
          pluralName: getName(10),
          getTitle: (action, item = null) => {
            let titleKey = `resources.${r.name}.titles.${action}`
            if (item) {
              return this.i18n.global.te(titleKey)
                  ? this.i18n.global.t(titleKey, item.raw)
                  : this.i18n.global.t(`va.pages.${action}`);
            }
            return this.i18n.global.te(titleKey)
              ? this.i18n.global.t(titleKey)
              : this.i18n.global.t(`va.pages.${action}`, {
                  resource: getName(action === "list" ? 10 : 1).toLowerCase(),
                })
          },
          canAction: async (action) => {
            /**
             * Test if action exist for this resource
             */
            if (!actions.includes(action)) {
              return false;
            }
            let canAction = this.canAction
            /**
             * Use custom action if defined
             */
            if (canAction) {
              let result = canAction({
                resource: r,
                action,
                can: await this.can,
              })

              /**
               * If valid boolean return this value instead of default next behavior
               */
              if (typeof result === "boolean") {
                return result
              }
            }
            /**
             * OK if no permissions set
             */
            if (!r.permissions) {
              return true
            }
            /**
             * Get permissions for asked action
             */
            let permissions = (r.permissions || [])
              .filter((p) => {
                return typeof p === "string" || p.actions.includes(action);
              })
              .map((p) => {
                return typeof p === "string" ? p : p.name;
              })

            let result = permissions.length && await this.can(permissions)
            
            // console.error(result)
        
            // Test if current user can access
            return result
          },
        }
    })

  } //  end setResource

  /**
   * Init to admin properties
   */
  init() {
    /**
     * Auth store & api dispatcher module injection
     */
    this.store.setModule("messages", messages);
    this.store.setModule("api", api);

    if (this.authProvider) {
      this.store.setModule("auth", auth).init(this.authProvider);  
    } else {
      this.store.setModule("auth", guest);
    }
    /**
     * Add API resources modules dynamically
     */
    if (this.dataProvider) {
      this.store.setModule("resource", storeResource).init({
        i18n: this.i18n,
        provider: this.dataProvider,       
      });
    }
    /**
     * Add resources routes dynamically
     */
    this.routes.children = this.resources
      .map((resource) =>
        routeResource({
          app: this.app,
          admin: this,
          store: this.store,
          i18: this.i18n,
          resource,
          title: this.i18n.global.t("titles." + this.title),
        })
      )
      .concat(
        (this.routes.children || []).map((r) => {
          r.meta = { ...(r.meta || {}), authenticated: true }
          return r;
        })
      )
    //
    // add routes dynmically
    // 
    this.router.addRoute(this.routes)

    /**
     * Check Auth after each navigation
     */
    this.router.beforeEach(async (to, from, next) => {

      this.store.getModule("messages").cleanError();
      this.store.getModule("messages").cleanSnackbar();
      /**
       * Set main and document title
       */
      document.title = to.meta.title
        ? `${this.i18n.global.t("titles." + lowerCase(to.meta.title))} | ${this.i18n.global.t("titles." + lowerCase(this.title))}`
        : this.i18n.global.t("titles." + lowerCase(this.title))
      next();
    })

    // this.router.push({ "name": "roles_list" });

  } // end init function

  /**
  * Permissions helper & directive
  */
  async can(permissions) {
    if (!this.authProvider || isEmpty(permissions)) {
        return false
    }
    const Self = this;
    let result = false;
    let user = await new Promise(function (resolve) {
      let res = cookies.get(Self.cookieKey.user) 
      if (res) {
        res = JSON.parse(res)    
        return resolve(res)
      }
      return resolve(null)
    }).catch(function (e) {
        console.error(e)
    })
    if (user && Array.isArray(permissions)) {
      user.permissions.forEach(function(roleKey) {
        if (permissions.includes(roleKey)) {
            result = true
        }
      })
    }
    return result
  }

  /**
   * Get global admin config object
   * 
   * @return 
   */
  getConfig() {
    return this.config;
  }

  /**
  * Get full resource object meta from name
  */
  getResource(name) {
    return this.resources.find((r) => r.name === name)
  }

  /**
  * Get label source, humanize it if not found
  */
  getSourceLabel(resource, source)  {
    if (resource && source) {
        let key = `resources.${resource}.fields.${source}`;
        return this.i18n.global.te(key)
          ? this.i18n.global.t(key)
          : upperFirst(lowerCase(source.replace(".", " ")));    
    }
    return null
  }

  /**
  * Resource link helper with action permission test
  */
  getResourceLink(link) {
    let getLink = ({ name, icon, text, action }) => {
      action = action || "list";
      let resource = this.getResource(name);

      if (!resource) {
        return false;
      }

      let { routes, canAction, singularName, pluralName } = resource

      /**
       * Route must exist
       */
      if (!routes.includes(action)) {
        return false;
      }

      /**
       * Current user must have permission for this action
       */
      if (!canAction(action)) {
        return false;
      }

      return {
        icon: icon || resource.icon,
        text: text || (action === "list" ? pluralName : singularName),
        link: { name: `${name}_${action}` },
      };
    }
    if (typeof link === "object") {
      return getLink(link);
    }
    return getLink({ name: link });
  }

  /**
  * Resource links list helper
  */
  getResourceLinks(links) {
    return links
      .map((link) => {
        if (typeof link === "object") {
          if (link.children) {
            return link;
          }

          return this.getResourceLink(link);
        }
        return this.getResourceLink({ name: link })
      })
      .filter((r) => r)
  }

  /**
  * Global confirm dialog function
  */
  confirm(title, message) {
    return this.store.getModule("messages").confirm({ title, message });
  }

  /**
   * Show global snackbar message
   */
  message(type, message) {
    this.store.getModule("messages").show({ type: type.toLowerCase(), message: message });
  }

  /**
   * Refresh the current page
   */
  refresh(resource) {
    return this.store.getResource(resource).refresh();
  }

  /**
   * Disable/enable "api errors" before/after http request(s)
   */
  hideApiErrors(status) {
    this.store.getModule("messages").hideApiErrors(status);
  }

} // end class
```