/**
 * @oloma.dev (c) 2023-2025
 * 
 * - plugins/use-http.js
 *
 * Defines useHttp() method to configure global http settings
 */
import router from "@/router";
import cookies from "@/helpers/cookies";
import eventBus from "@/helpers/eventbus";
/**
 * Get cookie constants object
 */
let isRefreshing = false;
let failedQueue = [];
let logoutCodes = [ // do not change these values because it is related to your back end api
    'authenticationRequired',
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
const useHttp = function (axios, store) {

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
       cookies.get("token") && 
       response.config.url == "/auth/session") {
        let config = response.config;
        config._retry = false; // retry value every must be false
        const delayRetryRequest = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, process.env.SESSION_UPDATE_TIME * 60 * 1000); // every x minutes 
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
            store.getModule("auth").logout();
            router.push({ name: "users_login" });
            return;
        }
        if (error.response.status === 401 
            && typeof error.response.data.data.code !== "undefined" 
            && logoutCodes.includes(error.response.data.data.code)
            ) {
            router.push({ name: "users_login" });
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
            let localToken = cookies.get("token");
            return new Promise(function (resolve, reject) {
              axios.post("auth/refresh", { token: localToken })
                .then((res) => {
                  if (res
                    && res["data"]
                    && res["data"]["data"]
                    && res["data"]["data"]["token"]) {
                    let newToken = res["data"]["data"]["token"];
                    cookies.set("token", newToken);
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
              store.getModule("auth").logout();
              return;
            }
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }
            return Promise.reject(_error);
          }

        } // 401 end       

        // console.error(error.response["data"]);

        //
        // php string errors
        // 
        if (error.response["data"]
            && error.response["data"]["data"] 
            && typeof error.response.data.data.error !== "undefined" 
            && typeof error.response.data.data.error === "string"
            && store.getModule("messages").getHideApiErrors == false
            ) {
          store.getModule("messages").show({ type: 'error', message: error.response.data.data.error });
          return;
        }
        //
        // php object errors
        // 
        if (error.response["status"]
            && error.response.status == 400
            && store.getModule("messages").getHideApiErrors == false
            ) {
          //
          // mezzio native errors
          //
          if (error.response["data"] 
            && error.response["data"]["error"]) {
            store.getModule("messages").show({ type: 'error', message: error.response["data"]["error"] });
            return;
          }
          //
          // info notifications
          //
          if (error.response["data"] 
            && error.response["data"]["data"] 
            && typeof error.response.data.data.info !== "undefined") {
            store.getModule("messages").show({ type: 'info', message: error.response.data.data.info });
            return;
          }
          //
          // form validation errors & general errors
          //
          parseApiErrors(error, store)
          return error.response;

        } // end response status

        return Promise.reject(error);
        
      } // end response

    } // end error
  );
};

/**
 * parse validation errors
 */
function parseApiErrors(error, store) {
  if (error.response["data"] 
    && error.response["data"]["data"] 
    && error.response["data"]["data"]["error"]) {
    let errorHtml = ""
    let hasError = false
    let errorObject = error.response.data.data.error
    if (errorObject instanceof Object) {
      errorHtml = '<ul class="snackbar-errors">';
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
        store.getModule("auth").logout();
      } else {
        hasError = true
      }
    }
    if (hasError) {
      store.getModule("messages").show({ type: 'error', message: errorHtml });
    }
    return error;
  }
}
/**
 * Export useHttp method
 */
export { useHttp };