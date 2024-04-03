<template>
  <v-app>
    <v-container fluid :style="{ height: getHeight, backgroundColor: getThemeColor }">
      <v-layout class="align-center justify-center">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  inject: ['vuetify'],
  data() {
    return {
      height: "100vh",
    };
  },
  computed: {
    getHeight() {
      return this.height;
    },
    getThemeColor() {
      return this.vuetify.theme.themes.value.defaultTheme.colors.primary;
    }
  }
};
</script>
