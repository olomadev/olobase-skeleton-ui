<template>
  <div class="d-flex">
    <v-menu>
      <template #activator="{ props }">
        <v-btn 
          class="text-capitalize" 
          variant="text"
          v-bind="props">
          <v-avatar v-if="locale" color="primary" class="mr-2" size="x-small">
            <v-img
              v-if="locale"
              alt="Flag"
            >
              <Flag :name="locale"></Flag>
            </v-img>
          </v-avatar>
          <v-spacer>{{ t(`locale.${locale}`) }}</v-spacer>
          <v-icon small right>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(lang, index) in supportedLocales"
          :key="index"
          :value="index"
          @click="switchLanguage(lang)"
        >
          <v-list-item-title>
            <v-avatar v-if="lang" color="primary" class="mr-2" size="x-small">
              <v-img
                v-if="lang"
                alt="Flag"
              >
                <Flag :name="lang"></Flag>
              </v-img>
            </v-avatar>
            {{ t(`locale.${lang}`) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Trans from "@/i18n/translation";
import Flag from '@/components/Flag.vue';

export default {
  components: {
    Flag,
  },
  setup() {
    const { t, locale } = useI18n();
    const supportedLocales = Trans.supportedLocales;
    const router = useRouter();
    return { t, locale, supportedLocales, router };
  },
  created() {
    const lang = Trans.guessDefaultLocale();
    if (this.supportedLocales.includes(lang)) { // assign browser language
      this.switchLanguage(lang);
    }
  },
  methods: {
    async switchLanguage(value) {
      const newLocale = value;
      await Trans.switchLanguage(newLocale);
      try {
        await this.router.replace({ params: { locale: newLocale } });
      } catch (e) {
        console.log(e);
        this.router.push("/");
      }
    }
  }
};
</script>
