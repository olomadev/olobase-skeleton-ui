<template>
  <v-form @submit.prevent="changePassword">
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <h1 class="h1">{{ $t("users.changePassword.title") }}</h1>
        </div>
        <v-row>
          <v-col sm="3">
            <va-password-input
              source="currentPassword"
              :label="$t('users.changePassword.fields.currentPassword')"
              v-model="model.currentPassword"
              :error-messages="currentPasswordErrors"
            >
            </va-password-input>
            <va-password-input
              source="password"
             :label="$t('users.changePassword.fields.newPassword')"
             v-model="model.newPassword"
             :error-messages="newPasswordErrors"
            >
            </va-password-input>
            <va-password-input
              source="passwordConfirmation"
             :label="$t('users.changePassword.fields.confirmPassword')"
             v-model="model.confirmPassword"
             :error-messages="confirmPasswordErrors"
            >
            </va-password-input>
          </v-col>
        </v-row>
        <v-btn
          color="primary"
          :loading="loading"
          type="submit"
        >
          {{ $t("i18n.actions.save") }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-form>

</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email, sameAs, minLength, maxLength } from "@vuelidate/validators";
import { provide } from 'vue'

export default {
  inject: [],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      loading: false,
      model: {
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,  
      }
    };
  },
  validations() {
    return {
      model: {
        currentPassword: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(16),
        },
        newPassword: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(16),
        },
        confirmPassword: {
          required,
          sameAs: sameAs(this.model.newPassword),
        }
      }
    }
  },
  computed: {
    currentPasswordErrors() {
      const errors = [];
      const field = "currentPassword";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid && errors.push(this.$t("v.text.required"));
      this.v$["model"][field].minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "8" }));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "16" }));
      return errors;
    },
    newPasswordErrors() {
      const errors = [];
      const field = "newPassword";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid && errors.push(this.$t("v.text.required"));
      this.v$["model"][field].minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "8" }));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "16" }));
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      const field = "confirmPassword";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid && errors.push(this.$t("v.text.required"));
      this.v$["model"][field].sameAs.$invalid &&
        errors.push(this.$t("v.password.sameAs"));
      return errors;
    },
  },
  methods: {
    async changePassword() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        return false;
      }
      if (await this.$store.getModule("auth").checkAuth()) {
        this.loading = true;
        try {
          let response = await this.$admin.http({ method: "PUT", url: "/account/updatePassword", data: this.model });
          if (response && response.status == 200) {
            response = await this.$admin.http({ method: "GET", url: "/auth/logout" });
            if (response.status == 200) {
              this.$store.getModule("auth").logout();
              this.$router.push({ name: "login" });
            }
          }
        } catch (e) {
          console.error(e)
        }
        this.loading = false;
      }
    },

  },
};
</script>