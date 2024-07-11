<template>
  <div>
    <va-messages></va-messages>

    <v-row no-gutters :style="smAndDown ? 'margin-top: 40px' : 'margin-top: 120px'">
      <v-alert
        v-if="resetPassword"
        class="mb-4"      
        color="primary"
        :text="$t('auth.passwordResetEmail')"
      ></v-alert>
    </v-row>

    <v-row no-gutters>
      <v-card 
        border
        flat
        class="noselect"
        :min-width="getReponsiveWidth"
      >
        <v-sheet color="white">
          <v-container>
            <div class="text-center mt-5 mb-6">
              <div style="letter-spacing: 1px;font-size:34px;" class="text-primary">logo</div>
            </div>
            <v-form @submit.prevent="validate">
              <v-text-field
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-account"
                v-model="username"
                name="username"
                :label="$t('auth.username')"
                type="text"
                variant="outlined"
                class="mx-1"
                clearable
                autocomplete="username"
                :error-messages="emailErrors"
                @update:modelValue="v$.username.$touch()"
              ></v-text-field>

              <v-text-field
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                name="password"
                :label="$t('auth.password')"
                variant="outlined"
                class="mx-1"
                autocomplete="password"
                :error-messages="passwordErrors"
                @click:append-inner="showPass = !showPass"
                @update:modelValue="v$.password.$touch()"
              ></v-text-field>

              <v-row class="mt-4">
                <v-col lg="6">
                  <div class="text-left">
                    <LanguageSwitcher></LanguageSwitcher>
                  </div>
                </v-col>
                <v-col lg="6">
                  <div class="text-right">
                    <v-btn
                      :loading="loading"
                      color="primary"
                      large
                      type="submit"
                      text
                    >
                      {{ $t("auth.signIn") }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-sheet>
      </v-card>
    </v-row>

    <v-row no-gutters v-if="countryId" class="mt-2" :min-width="getReponsiveWidth">
      <v-col>        
        <v-row class="mb-2" no-gutters>
          <v-col>
            <v-btn
              block
              variant="flat"
              class="text-none"
              prepend-icon="mdi-lock"
              size="large"
              text
              :to="{ name: 'forgotPassword' }"
            >
              {{ $t("auth.forgotPassword") }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mb-2" no-gutters>
          <v-col>
            <v-btn
              block
              variant="flat"
              class="text-none"
              prepend-icon="mdi-plus"
              size="large"
              text
              :to="{ name: 'register' }"
            >
              {{ $t("auth.createNewAccount") }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-btn
              block
              variant="flat"
              class="text-none"
              prepend-icon="mdi-arrow-left"
              size="large"
              text
            >
              {{ $t("auth.backToHome") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useDisplay } from "vuetify";
import { useVuelidate } from "@vuelidate/core";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import { mapActions } from "vuex";
import i18n from "../i18n";
import { useRoute } from 'vue-router';

export default {
  inject: ['store'],
  components: { LanguageSwitcher },
  setup() {
    const { smAndDown } = useDisplay();
    let resetPassword = useRoute().query.resetPassword;
    return { v$: useVuelidate(), smAndDown, resetPassword };
  },
  validations() {
    return {
      username: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(16),
      },
    }
  },
  data() {
    return {
      showPass: false,
      loading: false,
      username: "demo@example.com",
      password: "12345678",
    };
  },
  computed: {
    getReponsiveWidth() {
      if (this.smAndDown) {
        return 320;
      }
      return 360;
    },
    emailErrors() {
      const errors = [];
      if (!this.v$.username.$dirty) return errors;
      this.v$.username.required.$invalid &&
        errors.push(this.$t("v.email.required"));
      this.v$.username.email.$invalid &&
        errors.push(this.$t("v.email.invalid"));
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.v$.password.$dirty) return errors;
      this.v$.password.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "8" }));
      this.v$.password.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "16" }));
      this.v$.password.required.$invalid &&
        errors.push(this.$t("v.password.required"));
      return errors;
    },
  },
  methods: {
    ...mapActions({
      login: "auth/login",
    }),
    async validate() {
      this.v$.$touch();
      this.loading = false;
      if (this.v$.$invalid) {
        return;
      }
      this.loading = true;
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push({ name: "dashboard" });
      } catch (e) {
        this.loading = false;
      }
    },
    clear() {
      this.v$.$reset();
      this.username = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
.v-container {
  width: 100%;
  height: 100%;
}
.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
