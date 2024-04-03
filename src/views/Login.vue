<template>
  <div class="xs-12 sm-10 md-8 lg-6">

    <va-messages></va-messages>

    <v-row>
      <v-card width="350" class="noselect" style="margin-top: 200px">
        <v-alert
          v-if="resetPassword"
          type="info"
          :text="$t('auth.passwordResetEmail')"
          variant="tonal"
        ></v-alert>

        <v-container>
          <div class="text-center mb-9">
            <img
              id="profile-img"
              src="../assets/avatar_2x.png"
              class="profile-img-card"
            />
            <!-- <img src="../assets/logo-gray.png" width="80" height="80" /> -->
          </div>
          <v-form @submit.prevent="validate">
            
            <v-text-field
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

            <v-row class="mt-4 mb-1">
              <v-col lg="6">
                <div class="text-left">
                  <LanguageSwitcher />
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
                    rounded
                  >
                    {{ $t("auth.signIn") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-row>

    <v-row class="pt-2">
      <v-col sm="12">
        <div class="text-center">
          <router-link
            :to="{ name: 'forgotPassword' }"
            style="color: white; font-size: 13px"
          >
            {{ $t("auth.forgotPassword") }}
          </router-link>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import { mapActions } from "vuex";
import i18n from "../i18n";
import { useRoute } from 'vue-router';

export default {
  inject: ['store'],
  components: { LanguageSwitcher },
  setup() {
    let resetPassword = useRoute().query.resetPassword;
    return { v$: useVuelidate(), resetPassword };
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
