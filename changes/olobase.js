/*!
 * Oloma Dev.
 * 
 * [olobase] <https://github.com/olomadev/olobase>
 *
 * Copyright (c) 2022-2025, Oloma Software.
 */
import { upperFirst, lowerCase, isEmpty } from '@/helpers/lodash'
import cookies from '@/helpers/cookies'
import messages from "olobase-admin/src/store/messages"
import auth from "olobase-admin/src/store/auth"
import guest from "olobase-admin/src/store/guest"
import api from "olobase-admin/src/store/api"
import storeResource from "olobase-admin/src/store/resource"
import routeResource from "olobase-admin/src/router/resource"

export default class Olobase {

  setOptions({
    app,
    router,
    resources,
    store,
    i18n,
    downloadUrl,
    readFileUrl,
    routes,
    locales,
    authProvider,
    dataProvider,
    config,
    canAction,
    http
  }) {
    if (typeof process.env.COOKIE == "undefined") {
      throw new Error("Configuration error: ENV_COOKIE value is undefined in your project or .env file is missing.");
    }
    /**
     * Options properties
     */
    this.app = app
    this.router = router
    this.store = store
    this.i18n = i18n
    this.apiUrl = process.env.API_URL
    this.downloadUrl = downloadUrl
    this.readFileUrl = readFileUrl
    this.routes = routes
    this.locales = locales
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
            const module = r.module ? r.module.toLowerCase() : null;
            const resourceName = r.name;
            let key = module 
              ? `${module}.${resourceName}.title` 
              : `${resourceName}.${resourceName}.title`;
            if (item) {
              return this.i18n.global.te(key)
                  ? this.i18n.global.t(key, item.raw)
                  : this.i18n.global.t(`va.pages.${action}`);
            }
            return this.i18n.global.te(key)
              ? this.i18n.global.t(key)
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
          title: null, 
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
    let parts = [];
    if (to.meta.resource) {
      parts = to.meta.resource.includes("_") ? to.meta.resource.split("_") : [null, to.meta.resource];
      return this.getPageTitleValue(parts);
    }
    if (to.name) {
      parts = to.name.includes("_") ? to.name.split("_") : [null, to.name];
      return this.getPageTitleValue(parts);
    }
    return "undefined"
  }

  getPageTitleValue(parts) {
    if (Array.isArray(parts) && parts.length > 0) {
      const module = parts[0];
      const resourceName = parts[1];
      const key = module 
        ? `${module}.${resourceName}.title` 
        : `${resourceName}.${resourceName}.title`;
      return this.i18n.global.t(key);
    }
    return "undefined"
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
      let res = cookies.get("user") 
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

