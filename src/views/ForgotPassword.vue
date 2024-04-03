<template>
  <div class="xs-12 sm-10 md-8 lg-6">
    <va-messages></va-messages>
    <v-row>
      <v-card  style="margin-top: 200px">
        <v-container>
          <v-form @submit.prevent="validate">
            <v-text-field
              class="mx-1 mt-3"
              prepend-icon="mdi-account"
              v-model="email"
              name="email"
              :label="$t('auth.username')"
              type="text"
              variant="outlined"
              clearable
              :autocomplete="false"
              :error-messages="emailErrors"
              @input="v$.email.$touch()"
            ></v-text-field>

            <div v-if="siteKey">
              <!-- 
                https://www.npmjs.com/package/@hcaptcha/vue-hcaptcha#demo
                https://github.com/hCaptcha/vue-hcaptcha/blob/master/examples/traditional-vue3/src/App.vue 
              -->
              <vue-hcaptcha 
                :sitekey="siteKey"
                @verify="onVerify"
                @expired="onExpire"
                @challenge-expired="onChallengeExpire"
                @error="onError"
              ></vue-hcaptcha>
              <div 
                v-if="hCaptchaErrors.length > 0"
                class="v-messages__message error text-caption"
                >
                  {{ hCaptchaErrors[0] }}
              </div> 
            </div>
          
            <v-row class="mt-1 mb-1">
              <v-col sm="12">
                <div class="text-right">
                  <v-btn
                    :loading="loading"
                    color="primary"
                    large
                    type="submit"
                    text
                    rounded
                  >
                    {{ $t("auth.resetMyPassword") }}
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
            :to="{ name: 'login' }"
            style="color: white; font-size: 13px"
          >
            {{ $t("auth.backToLogin") }}
          </router-link>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

export default {
  inject: ['admin'],
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    VueHcaptcha
  },
  data() {
    return {
      verified: false,
      expired: false,
      token: null,
      eKey: null,
      error: null,
      email: null,
      siteKey: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
      loading: false,
    };
  },
  validations() {
    return {
      email: {
        required,
        email,
      },
      verified: { 
        isVerified: this.isVerified 
      }
    }
  },
  computed: {
    hCaptchaErrors() {
      const errors = [];
      if (!this.v$.verified.$dirty) return errors;
      this.v$.verified.isVerified.$invalid && errors.push(this.$t("v.captcha.invalid"));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.v$.email.$dirty) return errors;
      this.v$.email.email.$invalid &&
        errors.push(this.$t("v.email.invalid"));
      this.v$.email.required.$invalid &&
        errors.push(this.$t("v.email.required"));
      return errors;
    },
  },
  methods: {
    isVerified() {
      return this.verified ? true : false;
    },
    async validate() {
      this.v$.$touch();
      this.loading = false;
      if (this.v$.$invalid) {
        return;
      }
      let result = false;
      result = await this.http("post", "/auth/resetPassword", {
        email: this.email,
      });
      if (result) {
        this.clear();
        this.$router.push({ name: "login", query: { resetPassword: true } });
      }
    },
    clear() {
      this.v$.$reset();
      this.email = "";
      this.loading = false;
    },
    async http(method, url, data) {
      try {
        this.loading = true;
        await this.admin.http({ method, url, data });
        return true;
      } catch (e) {
        this.loading = false;
        console.log(e.message);
      }
      return false;
    },
    onVerify(tokenStr, ekey) {
      this.verified = true;
      this.token = tokenStr;
      this.eKey = ekey;
    },
    onExpire() {
      this.verified = false;
      this.token = null;
      this.eKey = null;
      this.expired = true;
    },
    onChallengeExpire() {
      this.verified = false;
      this.token = null;
      this.eKey = null;
      this.expired = true;
    },
    onError(err) {
      this.verified = false;
      this.token = null;
      this.eKey = null;
      this.error = err;
      console.error(`Error: ${err}`);
    }

  },
};
</script>