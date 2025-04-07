<template>
  <v-app>
    <v-container fluid :style="{ height: getHeight, backgroundColor: getThemeColor }">
      <v-layout class="align-center justify-center">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Translation from "@/modules/i18n/src/translation";

export default {
  inject: [],
  data() {
    return {
      height: "100vh",
    };
  },
  async created() {
    /**
     * Set default locale
     */
    const lang = Translation.guessDefaultLocale();
    if (lang && Translation.supportedLocales.includes(lang)) { // assign browser language
      await Translation.switchLanguage(lang);
    }
  },
  computed: {
    getHeight() {
      return this.height;
    },
    getThemeColor() {
      return this.$vuetify.theme.themes.light.colors.primary;
    }
  }
};
</script>
