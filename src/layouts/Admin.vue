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
          elevation="1"
          :header-menu="getHeaderMenu"
          sidebar-color="white"
        >
          <template v-slot:navbar-logo>
            <div class="text-center mt-12 mb-5 mr-6" style="font-family:'HankenGrotesk-Regular', 'Hanken Grotesk';font-size:24px; font-weight: bold; color: #0a7248;">
              Logo
            </div>
          </template>
          
          <template v-slot:profile>
            <v-menu offset-y v-if="userIsAuthenticated">
              <template v-slot:activator="{ props }">
                <v-btn icon small v-bind="props" class="mr-1">
                 <div v-if="isAvatarExists" style="float:left;">
                    <v-avatar size="24px">
                      <v-img 
                        :src="getAvatar"
                        alt="Avatar"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div v-else style="float:left;">
                    <v-icon>mdi-account-circle</v-icon>
                  </div>
                </v-btn>
              </template>
              <v-card min-width="300">
                <v-list nav>
                  <v-list-item
                    class="mb-2 mt-2" 
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
                    <v-card-text style="padding:0px">
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
            </v-menu>
          </template>
          
        </va-app-bar>
      </template>

      <template #header>
        <va-breadcrumbs></va-breadcrumbs>
      </template>

      <template #aside>
        <va-aside></va-aside>
      </template>

      <template #footer>
        <va-footer 
          :key="getCurrentLocale" 
          :menu="getFooterMenu"
        >
          <template v-slot:left>
            <LanguageSwitcher></LanguageSwitcher>
          </template>
          <template v-slot:right>
            <span style="font-size:13px">&copy; 2024</span>
          </template>
        </va-footer>
      </template>
    </va-layout>
  </v-app>
</template>

<script>
import isEmpty from "lodash/isEmpty"
import { useDisplay } from "vuetify";
import Trans from "@/i18n/translation";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { storeToRefs } from 'pinia'

export default {
  name: "App",
  inject: [],
  components: { LanguageSwitcher },
  setup() {
    const { lgAndUp } = useDisplay();
    return { lgAndUp };
  },
  data() {
    return {
      avatar: null,
      avatarExists: false,
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
    this.authenticatedUser = await this.$store.getModule("auth").checkAuth();
    if (! this.authenticatedUser) {
      this.$router.push({name: "login"});
    } else {
      // 
      // Please do not remove it, it periodically updates the session lifetime.
      // Thus, as long as the user's browser is open, the user logged in to the application,
      // otherwise the session will be closed when the ttl period expires.
      // 
      this.$admin.http.post('/auth/session', { update: 1 }); 
    }
    /**
     * Check avatar
     */
    let base64Image = this.$store.getModule("auth").getAvatar();
    if (base64Image == "undefined" || base64Image == "null" || isEmpty(base64Image)) { 
      this.avatar = this.$admin.getConfig().avatar.base64; // default avatar image
      this.avatarExists = false;
    } else {
      this.avatarExists = true;
      this.avatar = base64Image;
    }
  },
  computed: {
    getCurrentLocale() {
      const { locale } = storeToRefs(this.$store);
      return locale;
    },
    isAvatarExists() {
      return this.avatarExists;
    },
    getAvatar() {
      return this.avatar;
    },
    getEmail() {
      return this.$store.getModule("auth").getEmail();
    },
    getFullname() {
      return this.$store.getModule("auth").getFullname();
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
    userIsAuthenticated() {
      return this.$store.getModule("auth").user;
    },
    logout() {
      this.$store.getModule("auth").logout();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
