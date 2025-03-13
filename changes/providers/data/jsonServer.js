import { isObject } from '@/helpers/lodash';
import {
  GET_LIST,
  GET_LIST_ALL,
  GET_MANY,
  GET_ONE,
  CREATE,
  UPDATE,
  UPDATE_ROW,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
  COPY,
  COPY_MANY
} from "./actions";

import FetchJson from "../utils/fetchJson";
import qs from "qs";

export default (httpClient) => {
  if (typeof httpClient === "string") {
    httpClient = new FetchJson(httpClient);
  }

  const withInclude = (params) => {
    let query = {};

    if (params.include) {
      let { embed, expand } = params.include;
      query = {
        _embed: embed,
        _expand: expand,
      };
    }

    return query;
  };

  return {
    [GET_LIST]: async (module, resource, params) => {
        const { pagination, sort, filter } = params;

        // if the filter has array lets write them
        // in query string array format ["key"] = value
        // 
        var newFilter = {}

        if (isObject(filter)) {
          for (const [key, value] of Object.entries(filter)) {
              if (Array.isArray(value)) {
                  newFilter[key + "[]"] = value  
              } else {
                  newFilter[key] = value
              }
          }    
        }
        let query = {
            ...withInclude(params),
            ...newFilter,
        }

        if (params.defaultQueryString) {
            query = {
              ...query,
              ...params.defaultQueryString
            }
        }

        if (pagination) {
        let { page, perPage } = pagination;
            query = {
              ...query,
              _perPage: perPage,
              _page: page,
              // _start: (page - 1) * perPage,
              // _end: page * perPage,
            }
        }

        if (sort && sort.length) {
            query = {
              ...query,
              "_sort[]": sort.map((item) => item.by),
              "_order[]": sort.map((item) => (item.desc ? "desc" : "asc")),
            }
        }
        let url = module ? `${module}/${resource}/findAllByPaging?${qs.stringify(query, { arrayFormat: "repeat" })}` 
                         : `${resource}/findAllByPaging?${qs.stringify(query, { arrayFormat: "repeat" })}`;
                         
        let response = await httpClient.get(url);
        if (response && response["data"]) {
          let { data, headers } = response;
          return {
              data,
              total: parseInt(headers["x-total-count"], 10),
          };
        }
        return {
          data: null,
          total: 0,
        };
    },
    [GET_LIST_ALL]: async (module, resource, params) => {

      const { filter } = params;

      if (typeof params.ids != 'undefined') {
          for (const val of params.ids) {
              filter["id[]"] = val.id
          }
      }
      let query = {
        ...withInclude(params),
        ...filter,
      };
      let url = module 
         ? `${module}/${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}` 
         : `${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}`;

      let response = await httpClient.get(url);
      if (response && response["data"]) {
        let { data, headers } = response;
        return {
          data,
          total: parseInt(headers["x-total-count"], 10),
        };  
      }
      return {
        data: null,
        total: 0,
      };
    },

    [GET_MANY]: async (module, resource, params) => {

      const { filter } = params;

      var newFilter = {}
      for (const [key, value] of Object.entries(filter)) {
          if (isObject(value)) {
            for (const property in value) {
              newFilter[property + "[]"] = value[property]
            }
          }
          if (Array.isArray(value)) {
              newFilter[key + "[]"] = value  
          } 
      }
      let query = {
          ...withInclude(params),
          ...newFilter,
      }
      let url = module 
         ? `${module}/${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}` 
         : `${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}`;

      return httpClient.get(url)

      // const { filter } = params;

      // let query = {
      //     ...withInclude(params),
      //     ...filter,
      // }
      // return httpClient.get(
      //     `${resource}/findAll?${qs.stringify(query, { arrayFormat: "repeat" })}`
        // )
    },
    [GET_ONE]: async (module, resource, params) => {
      let url = module 
         ? `${module}/${resource}/findOneById/${params.id}?${qs.stringify(withInclude(params))}`
         : `${resource}/findOneById/${params.id}?${qs.stringify(withInclude(params))}`

      let response = await httpClient.get(url)
      if (response && response["data"]) {
        let { data } = response;
        return data;
      }
    },
    [CREATE]: (module, resource, params) => { 
      let url = module 
        ? `${module}/${resource}/create`
        : `${resource}/create`;

      return httpClient.post(url, params.data)
    },
    [UPDATE]: (module, resource, params) => {
      let url = module 
        ? `${module}/${resource}/update/${params.id}` 
        : `${resource}/update/${params.id}`;

      return httpClient.put(url, params.data);
    },
    [UPDATE_ROW]: (module, resource, params) => {
      let url = module 
        ? `${module}/${resource}/updateRow/${params.id}`
        : `${resource}/updateRow/${params.id}`;

      return httpClient.put(url, params.data);
    },
    [UPDATE_MANY]: (module, resource, params) => {
      const updatePromises = params.ids.map((id) => {
        let url = module ? `${module}/${resource}/update/${id}` : `${resource}/update/${id}`;

        return httpClient.put(url, params.data);
      });
      return Promise.all(updatePromises)
       .then(() => {
         return Promise.resolve();
       });
    },
    [DELETE]: (module, resource, params) => {
      if (params['query'] && typeof params['query'] === 'object') {
        const queryString = Object.entries(params['query']).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");

        let url = module 
          ? `${module}/${resource}/delete/${params.id}?` 
          : `${resource}/delete/${params.id}?`;

        httpClient.delete(url + queryString);

      } else {

        let url = module 
          ? `${module}/${resource}/delete/${params.id}` 
          : `${resource}/delete/${params.id}`;

        httpClient.delete(url);
      }
    },
    [DELETE_MANY]: (module, resource, params) => {
      const deletePromises = params.ids.map((id) => {
        let url = module 
          ? `${module}/${resource}/delete/${id}` 
          : `${resource}/delete/${id}`;

        return httpClient.delete(url);
      });
      return Promise.all(deletePromises)
        .then(() => {
          return Promise.resolve();
      });
    },
    [COPY]: (module, resource, params) => {
      let url = module ? `${module}/${resource}/copy/${params.id}` : `${resource}/copy/${params.id}`;

      return httpClient.post(url, params.data);
    },
    [COPY_MANY]: (module, resource, params) => {
      const copyPromises = params.ids.map((id) => {
        let url = module ? `${module}/${resource}/copy/${id}` : `${resource}/copy/${id}`;

        return httpClient.post(url, params.data);
      });
      return Promise.all(copyPromises)
        .then(() => {
          return Promise.resolve();
      });
    },

  };
};
