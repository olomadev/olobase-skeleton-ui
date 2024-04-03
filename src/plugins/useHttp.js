/**
 * @oloma.dev (c) 2023-2024
 * 
 * - plugins/useHttp.js
 *
 * Defines useHttp() method to configure global http settings
 */
import i18n from "../i18n";
import store from "@/store";
import router from "@/router";
import cookies from "olobase-admin/src/utils/cookies";
import eventBus from "olobase-admin/src/utils/eventBus";
/**
 * Get cookie constants object
 */
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);

let isRefreshing = false;
let failedQueue = [];
let logoutCodes = [ // do not change these values because it is related to your back end api
    'ipValidationFailed',
    'userAgentValidationFailed',
];
//
// https://github.com/Godofbrowser/axios-refresh-multiple-request/tree/master
// 
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
/**
 * Http global response settings
 */
const useHttp = function (axios) {
  let axiosInstance = axios;  
  axiosInstance.interceptors.response.use(
    (response) => {
      const statusOk = (response && response["status"] && response.status === 200) ? true : false;
      const configUrlSegments = response.config.url.split('/');
      if (
        (statusOk && configUrlSegments.includes("create")) || 
        (statusOk && configUrlSegments.includes("update"))
      ) {
        eventBus.emit("last-dialog", false)  // close edit modal window if it's opened
      }
      if (statusOk &&
       cookies.get(cookieKey.token) && 
       response.config.url == "/auth/session") {
        let config = response.config;
        config._retry = false; // retry value every must be false
        const delayRetryRequest = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, import.meta.env.VITE_SESSION_UPDATE_TIME * 60 * 1000); // every x minutes 
        });
        return delayRetryRequest.then(() => axiosInstance(config));
      }
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response) {
        if (error.response.status === 401 
            && error.response.data.data.error == "Logout") {
            store.dispatch("auth/logout");
            return;
        }
        if (error.response.status === 401 
            && typeof error.response.data.data.code !== "undefined" 
            && logoutCodes.includes(error.response.data.data.code)
            ) {
            setTimeout(function(){
              store.commit("messages/show", { type: 'error', message: error.response.data.data.error });
            }, 300);
            store.dispatch("auth/logout");
            return;
        }
        if (error.response.status === 401 
            && error.response.data.data.error == "Token Expired" 
            && !originalRequest._retry
        ) {
          try {
            if (isRefreshing) {
              return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
              })
              .then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axiosInstance(originalRequest);
              })
              .catch(err => {
                  return Promise.reject(err);
              });
              // console.error(failedQueue);
            }
            // do token refresh request
            //
            isRefreshing = true;
            originalRequest._retry = true;
            let localToken = cookies.get(cookieKey.token);
            return new Promise(function (resolve, reject) {
              axios.post("auth/refresh", { token: localToken })
                .then((res) => {
                  if (res
                    && res["data"]
                    && res["data"]["data"]
                    && res["data"]["data"]["token"]) {
                    let newToken = res["data"]["data"]["token"];
                    cookies.set(cookieKey.token, newToken);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                    processQueue(null, newToken);
                    resolve(axiosInstance(originalRequest));
                  }
                })
                .catch((err) => {
                  processQueue(err, null);
                  reject(err);
                })
                .finally(() => { isRefreshing = false })
            });
          } catch (_error) {
            if (_error.response 
             && _error.response["status"] 
             && _error.response.status == 401) { // Token expired
              store.dispatch("auth/logout");
              return;
            }
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }
            return Promise.reject(_error);
          }

        } // 401 end       

        //
        // php string errors
        // 
        if (error.response["data"]
            && error.response["data"]["data"] 
            && typeof error.response.data.data.error !== "undefined" 
            && typeof error.response.data.data.error === "string"
            && store.getters["messages/getHideApiErrors"] == false
            ) {
          store.commit("messages/show", { type: 'error', message: error.response.data.data.error });
          return;
        }
        //
        // php object errors
        // 
        if (error.response["status"]
            && error.response.status == 400
            && store.getters["messages/getHideApiErrors"] == false
            ) {
          //
          // mezzio native errors
          //
          if (error.response["data"] 
            && error.response["data"]["error"]) {
            store.commit("messages/show", { type: 'error', message: error.response["data"]["error"] })
            return;
          }
          //
          // info notifications
          //
          if (error.response["data"] 
            && error.response["data"]["data"] 
            && typeof error.response.data.data.info !== "undefined") {
            store.commit("messages/show", { type: 'info', message: error.response.data.data.info });
            return;
          }
          //
          // form validation errors & general errors
          //
          parseApiErrors(error)
          return;

        } // end response status

        return Promise.reject(error);
        
      } // end response

    } // end error
  );
};

/**
 * parse validation errors
 */
function parseApiErrors(error) {
  if (error.response["data"] 
    && error.response["data"]["data"] 
    && error.response["data"]["data"]["error"]) {
    let errorHtml = ""
    let hasError = false
    let errorObject = error.response.data.data.error
    if (errorObject instanceof Object) {
      errorHtml = "<ul>";
      Object.keys(errorObject).forEach(function (k) {
        if (Array.isArray(errorObject[k])) {
          hasError = true;
          errorObject[k].forEach(function (subObject) {
            if (typeof subObject === "string") {
              errorHtml += '<li>' + `${subObject}` + '</li>'
            } else if (typeof subObject === "object") {
              Object.values(subObject).forEach(function (subErrors) {
                if (Array.isArray(subErrors)) {
                  subErrors.forEach(function (strError) {
                    errorHtml += '<li>' + `${strError}` + '</li>'
                  });
                }
              });
            }
          });
        } else {
          hasError = true;
          errorHtml += '<li>' + `${errorObject[k]}` + '</li>'
        }
      })
      errorHtml += "</ul>"; 
    } else if (typeof errorObject === "string") {
      errorHtml = errorObject
      if (errorObject == "Token Expired") {
        store.dispatch("auth/logout");
      } else {
        hasError = true
      }
    }
    if (hasError) {
      store.commit("messages/show", { type: 'error', message: errorHtml })
    }
    return error;
  }
}
/**
 * Export useHttp method
 */
export { useHttp };