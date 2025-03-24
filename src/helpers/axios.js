/**
 * @oloma.dev (c) 2023-2025
 *
 * - helpers/axios.js
 * 
 * Cookie helper for production and dev environment
 */
import axios from "axios";
import cookies from "@/helpers/cookies";

/**
 * Set default global http configuration
 */
axios.defaults.timeout = 20000;
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Content-Type'] = "application/json";

/**
 * Axios request interceptor for adding token
 */
axios.interceptors.request.use(
  function (config) {
    let token = cookies.get("token");
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
 * Export axios instance to use in other parts of the application
 */
export default axios;
