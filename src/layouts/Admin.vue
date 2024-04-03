<template>
  <v-app>
    <va-layout 
      v-if="authenticatedUser"
    >
      <template #appbar>
        <va-app-bar
          :key="getCurrentLocale"
          color="primary"
          density="compact"
          :header-menu="getHeaderMenu"
          sidebar-color="white"
        >
          <template v-slot:logo>
            <div class="mb-1" style="letter-spacing: 1px;">logo</div>
          </template>

          <template v-slot:avatar>
            <v-avatar v-if="avatarExists" size="24px">
              <v-img 
                :src="getAvatar"
                alt="Avatar"
              ></v-img>
            </v-avatar>
            <v-icon v-else>mdi-account-circle</v-icon>
          </template>

          <template v-slot:profile>
            <v-card min-width="300">
              <v-list nav>
                <v-list-item 
                   v-if="getFullname"
                  :prepend-avatar="getAvatar"
                >
                  <div class="list-item-content">
                    <v-list-item-title class="title">{{ getFullname }}</v-list-item-title>
                    <v-list-item-subtitle v-if="getEmail">{{ getEmail }}</v-list-item-subtitle>
                  </div>
                </v-list-item>
                <v-divider></v-divider>
                <v-card flat>
                  <v-card-text style="padding:9px">
                    <v-list-item
                      v-for="(item, index) in getProfileMenu"
                      :key="index"
                      link
                      :to="item.link"
                      @click="item.logout ? logout() : null"
                      class=" mt-2"
                    >
                      <template v-slot:prepend>
                        <v-icon>{{ item.icon }}</v-icon>
                      </template>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-card-text>
                </v-card>
              </v-list>
            </v-card>
          </template>
        </va-app-bar>
      </template>

      <template #header>
        <va-breadcrumbs />
      </template>

      <template #aside>
        <va-aside />
      </template>

      <template #footer>
        <va-footer 
          :key="getCurrentLocale" 
          :menu="getFooterMenu"
        >
          <span style="font-size:13px">&copy; 2023</span>
        </va-footer>
      </template>
    </va-layout>
  </v-app>
</template>

<script>
import isEmpty from "lodash/isEmpty"
import { useDisplay } from "vuetify";
import { mapActions } from "vuex";
import Trans from "@/i18n/translation";

export default {
  name: "App",
  inject: ["admin"],
  setup() {
    const { lgAndUp } = useDisplay();
    return { lgAndUp };
  },
  data() {
    return {
      authenticatedUser: null,
    };
  },
  async created() {
    /**
     * Set default locale
     */
    const lang = Trans.guessDefaultLocale();
    if (lang && Trans.supportedLocales.includes(lang)) { // assign browser language
      await Trans.switchLanguage(lang);
    }
    /**
     * Check user is authenticated
     */
    this.authenticatedUser = await this.checkAuth();
    if (! this.authenticatedUser) {
      this.$router.push({name: "login"});
    } else {
      // 
      // Please do not remove it, it periodically updates the session lifetime.
      // Thus, as long as the user's browser is open, the user logged in to the application,
      // otherwise the session will be closed when the ttl period expires.
      // 
      this.admin.http.post('/auth/session', { update: 1 }); 
    }
  },
  computed: {
    avatarExists() {
      let base64Image = this.$store.getters["auth/getAvatar"];
      if (base64Image == "undefined" || base64Image == "null" || isEmpty(base64Image)) { 
        return false;
      }
      return true;
    },
    getAvatar() {
      let base64Image = this.$store.getters["auth/getAvatar"]; 
      if (base64Image == "undefined" || base64Image == "null" || isEmpty(base64Image)) { 
        return this.admin.getConfig().avatar.base64; // default avatar image
      }
      return base64Image;
    },
    getEmail() {
      return this.$store.getters["auth/getEmail"];
    },
    getFullname() {
      return this.$store.getters["auth/getFullname"];
    },
    getCurrentLocale() {
      return this.$store.getters[`getLocale`];
    },
    getHeaderMenu() {
      return [];
    },
    getProfileMenu() {
      return [
        {
          icon: "mdi-account",
          text:  this.$t("va.account"),
          link: "/account",
        },
        {
          icon: "mdi-key-variant",
          text: this.$t("va.changePassword"),
          link: "/password",
        },
        {
          icon: "mdi-logout",
          text: this.$t("va.logout"),
          logout: true,
        },
      ];
    },
    getFooterMenu() {
      const lang = Trans.guessDefaultLocale();
      let link = "https://oloma.dev/end-user-license-agreement";
      if (lang != "en") {
        link = "https://" + lang + ".oloma.dev/end-user-license-agreement";
      }
      return [
        {
          href: link,
          text: this.$t("menu.terms"),
        },
      ]
    }
  },
  methods: {
    ...mapActions({
      checkAuth: "auth/checkAuth",
    }),
    logout() {
      this.$store.dispatch("auth/logout");
    },
  },
};
</script>
