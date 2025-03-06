/*!
 * Oloma Dev.
 * 
 * [olobase] <https://github.com/olomadev/olobase>
 *
 * Copyright (c) 2022-2025, Oloma Software.
 */
import { upperFirst, lowerCase, isEmpty } from "lodash"
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

        //---- module changes start --------------------------

        let moduleName = r.module || null; // default null
        let resourcePath = r['standalone'] ? `${r.name}` :  `${moduleName}/${r.name}`;

        //---- module changes end --------------------------

        return {
          ...r,
          module: moduleName,
          resourcePath,
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
      document.title = this.getPageTitle(to)
      next();
    })

  } // end init function

  getPageTitle(to) {
    if (to.meta.resource) {
      const parts = to.meta.resource.includes("_") ? to.meta.resource.split("_") : [null, to.meta.resource];
      const module = parts[0];
      const resourceName = parts[1];
      let key = module 
        ? `${module}.${resourceName}.title` 
        : `${resourceName}.${resourceName}.title`;
      return this.i18n.global.t(key);
    }
    if (to.meta.title) {
      return to.meta.title
          ? `${this.i18n.global.t("titles." + lowerCase(to.meta.title))} | ${this.i18n.global.t("titles." + lowerCase(this.title))}`
          : this.i18n.global.t("titles." + lowerCase(this.title))
    }
    return "undefined";
  }

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
    const parts = resource.includes("_") ? resource.split("_") : [null, resource];
    const module = parts[0];
    const resourceName = parts[1];

    if (resourceName && source) {
      let key = module 
        ? `${module}.${resourceName}.fields.${source}` 
        : `${resourceName}.fields.${source}`;

      let translatedValue = this.i18n.global.te(key)
        ? this.i18n.global.t(key)
        : upperFirst(lowerCase(source.replace(".", " ")));
      return translatedValue
    }
    return null
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

