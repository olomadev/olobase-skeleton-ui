<template>
  <div class="xs-12 sm-10 md-8 lg-6">
    <div v-if="resetCodeIsValid"> 
      <v-row>
        <v-card width="375" style="margin-top: 200px">
          <v-card-title class="mt-2">
            {{ $t("auth.setNewPassword") }}
          </v-card-title>
          <v-container>
            <v-form ref="form" @submit.prevent="validate">
              <v-text-field
                class="mx-1 mt-2"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="newPassword"
                name="newPassword"
                :label="$t('auth.newPassword')"
                type="password"
                variant="outlined"
                :autocomplete="false"
                :error-messages="newPasswordErrors"
                @click:append-inner="showPass = !showPass"
                @update:modelValue="v$.newPassword.$touch()"
              ></v-text-field>
              <v-text-field
                class="mx-1"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="newPasswordConfirm"
                name="newPasswordConfirm"
                :label="$t('auth.newPasswordConfirm')"
                type="password"
                variant="outlined"
                :autocomplete="false"
                :error-messages="newPasswordConfirmErrors"
                @click:append-inner="showPass = !showPass"
                @update:modelValue="v$.newPasswordConfirm.$touch()"
              ></v-text-field>
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
                      {{ $t("auth.changeMyPassword") }}
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
    <div v-else>
      <v-row>
        <v-container style="margin-top: 200px;width:600px;">
          <v-alert
            density="compact"
            :title="$t('auth.passwordResetWrongCodeTitle')"
          ><div style="font-size:16px;">{{ $t('auth.passwordResetWrongCode') }}</div>
          </v-alert>
        </v-container>
      </v-row>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, minLength, sameAs } from "@vuelidate/validators";
import Utils from "olobase-admin/src/mixins/utils";

export default {
  mixins: [Utils],
  inject: ['admin'],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      showPass: false,
      resetCode: null,
      newPassword: null,
      newPasswordConfirm: null,
      loading: false,
      resetCodeIsValid: false,
    };
  },
  async created() {
    this.resetCode = this.getQueryParam("resetCode");
    this.resetCodeIsValid = await this.http("get", "/auth/checkResetCode?resetCode=" + this.resetCode);
  },
  validations() {
    return {
      newPassword: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(16),
      },
      newPasswordConfirm: {
        required,
        sameAs: sameAs(this.newPassword),
      },
    }
  },
  computed: {
    newPasswordErrors() {
      const errors = [];
      if (!this.v$.newPassword.$dirty) return errors;
      this.v$.newPassword.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$.newPassword.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "8" }));
      this.v$.newPassword.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "16" }));
      return errors;
    },
    newPasswordConfirmErrors() {
      const errors = [];
      if (!this.v$.newPasswordConfirm.$dirty) return errors;
      this.v$.newPasswordConfirm.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$.newPasswordConfirm.sameAs.$invalid &&
        errors.push(this.$t("v.password.sameAs"));
      return errors;
    },
  },
  methods: {
    async validate() {
      this.v$.$touch();
      this.loading = false;
      if (this.v$.$invalid) {
        return;
      }
      let result = false;
      result = await this.http("post", "/auth/changePassword", {
        resetCode: this.resetCode,
        newPassword: this.newPassword,
        newPasswordConfirm: this.newPasswordConfirm,
      });
      if (result) {
        this.$store.commit("messages/show", { type: "success", message: this.$t("auth.passwordResetEmail") });
        this.$router.push({ name: "login" });
      }
    },
    clear() {
      this.v$.$reset();
      this.username = "";
    },
    async http(method, url, data) {
      try {
        this.loading = true;
        let result = await this.admin.http({ method, url, data });
        if (typeof result === 'object' && result !== null
            && result["status"] 
            && result.status == 200) {
          this.loading = false;
          return true;
        }
        return false;
      } catch (e) {
        this.loading = false;
        console.log(e.message);
      }
      return false;
    },
  },
};
</script>
