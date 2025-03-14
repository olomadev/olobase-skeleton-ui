import { defineStore } from "pinia";
import cookies from '@/helpers/cookies'
import useStore from "@/store"
//
// export factory function 
// 
// https://stackoverflow.com/questions/71583063/how-to-pass-an-argument-to-pinia-store
// https://stackoverflow.com/questions/74936421/how-do-i-pass-a-parameter-to-pinia-getter-in-vue
// 
const auth = defineStore('auth', {
    state: () => {
      return { 
        response: null,
        provider: null,
      }
    },
    getters: {
      getEmail() {
        if (this.response && this.provider['getEmail']) {
          return this.provider.getEmail(this.response);
        }
      },
      getFullname() {
        if (this.response && this.provider['getFullname']) {
          return this.provider.getFullname(this.response);
        }
      },
      getAvatar() {
        if (this.response && this.provider['getAvatar']) {
          return this.provider.getAvatar(this.response);
        }
      },
      getId() {
        if (this.response && this.provider['getId']) {
          return this.provider.getId(this.response);
        }
      },
      getPermissions() {
        if (this.response && this.provider['getPermissions']) {
          return this.provider.getPermissions(this.response) || [];
        }
        return [];
      },
    },
    actions: {
      /**
       * Initialize with given auth provider
       */
      init(provider) {
        this.provider = provider;
      },
      /**
       * Server login with given credentials
       * checkAuth action will set fresh user infos on store automatically
       */
      async login(credentials) {
        let response = await this.provider.login(credentials);
        if (response 
          && response['data'] 
          && response['data']['data']) {
          this.response = response['data']['data'];
        }
        return Promise.resolve(response);
      },
      /**
       * Server logout
       */
      async logout() {
        let response = await this.provider.logout();
        return Promise.resolve(response);
      },
      /**
       * Check valid auth on target route server by retrieving user infos
       * Set fresh user infos on store
       * Called after each URL navigation
       */
      async checkAuth() {
        if (! cookies.get("token")) {
          this.response = null;
          return false
        }
        try {
          let response = await this.provider.checkAuth();
          if (response) {
            this.response = response.data;
          }
          return response.data;
        } catch (e) {
          this.response = null;
        }
      },
      /**
       * Check API error status
       * Called after each API error (4xx, 5xx)
       * Do automatic logout if reject promise returned
       */
      async checkError(error) {
        try {
          await this.provider.checkError(error);
        } catch (e) {
          await this.logout();
        }
      },
    },
  }
);

export default auth;