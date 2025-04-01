<template>
  <div class="d-flex">
    <v-menu>
      <template #activator="{ props }">
        <v-btn 
          class="text-capitalize" 
          variant="text"
          v-bind="props"
        >
          <v-avatar v-if="locale" color="primary" class="mr-2" size="x-small">
            <v-img
              v-if="locale"
              alt="Flag"
            >
              <Flag :name="locale"></Flag>
            </v-img>
          </v-avatar>
          <v-spacer>{{ $t(`i18n.languages.${locale}`) }}</v-spacer>
          <v-icon small right>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(lang, index) in getSupportedLocales"
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
            {{ $t(`i18n.languages.${lang}`) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Flag from '@/components/Flag.vue';
import Translation from "@/modules/i18n/src/translation";

export default {
  components: {
    Flag,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      locale: null
    }
  },
  created() {
    this.locale = Translation.guessDefaultLocale();
    if (Translation.supportedLocales.includes(this.locale)) { // assign browser language
      this.switchLanguage(this.locale);
    }
  },
  methods: {
    async switchLanguage(value) {
      const newLocale = value;
      await Translation.switchLanguage(newLocale);
      this.locale = value;
      try {
        await this.router.replace({ params: { locale: newLocale } });
      } catch (e) {
        console.error(e);
        this.router.push("/");
      }
    }
  },
  computed: {
    getSupportedLocales() {
      return Translation.supportedLocales;
    }
  }
};
</script>
