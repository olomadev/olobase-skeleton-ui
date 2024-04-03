<template>
  <v-form @submit.prevent="changePassword">
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <h1 class="h1">{{ $t("resources.account.passwordChange") }}</h1>
        </div>
        <v-row>
          <v-col sm="3">
            <va-password-input
              source="currentPassword"
              resource="account"
              v-model="model.currentPassword"
              :error-messages="currentPasswordErrors"
            >
            </va-password-input>
            <va-password-input
              source="password"
              resource="account"
             v-model="model.newPassword"
             :error-messages="newPasswordErrors"
            >
            </va-password-input>
            <va-password-input
              source="passwordConfirmation"
              resource="account"
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
          {{ $t("va.actions.save") }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-form>

  <v-tabs
    class="mt-3"
    v-model="tab"
    variant="outlined"
    bg-color="transparent"
    color="primary"
    align-tabs="left"
  >
    <v-tab value="1">Template</v-tab>
    <v-tab value="2">Script</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item eager value="1">
      <v-card>
        <v-card-text>
          <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
          <pre><code class="language-html">{{ template }}</code></pre>
        </v-card-text>
      </v-card>
    </v-window-item>

    <v-window-item eager value="2">
      <v-card>
        <v-card-text>
          <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
          <pre><code class="language-js">{{ script }}</code></pre>
        </v-card-text>
      </v-card>
    </v-window-item>
  </v-window>

</template>

<script>
import Clipboard from "olobase-admin/src/mixins/clipboard";
import { mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, email, sameAs, minLength, maxLength } from "@vuelidate/validators";
import { provide } from 'vue'

export default {
  mixins: [Clipboard],
  inheritAttrs: false,
  inject: ['admin'],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      companyId: { id: "ebf6b935-5bd8-46c1-877b-9c758073f278", name: "Demo Company 1" },
      departmentId: null,

      tab: null,
      template: null,
      script: null,
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
  created() {
    this.template = `\<template\>
<v-form @submit.prevent="changePassword">
  <v-card flat>
    <v-card-text>
      <div class="d-flex align-center mb-2">
        <h1 class="h1">{{ $t("resources.account.passwordChange") }}</h1>
      </div>
      <v-row>
        <v-col sm="3">
          <va-password-input
            source="currentPassword"
            resource="account"
            v-model="model.currentPassword"
            :error-messages="currentPasswordErrors"
          >
          </va-password-input>
          <va-password-input
            source="password"
            resource="account"
           v-model="model.newPassword"
           :error-messages="newPasswordErrors"
          >
          </va-password-input>
          <va-password-input
            source="passwordConfirmation"
            resource="account"
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
        {{ $t("va.actions.save") }}
      </v-btn>
    </v-card-text>
  </v-card>
</v-form>
\</template\>`;

    this.script = `\<script\>
import { mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, email, sameAs, minLength, maxLength } from "@vuelidate/validators";
import { provide } from 'vue'

export default {
  inject: ['admin'],
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
          sameAs: sameAs(this.newPassword),
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
      this.v$["model"][field].sameAs.$invalid &&
        errors.push(this.$t("v.password.sameAs"));
      return errors;
    },
  },
  methods: {
    ...mapActions({
      checkAuth: "auth/checkAuth",
    }),
    async changePassword() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        return false;
      }
      if (this.checkAuth()) {
        this.loading = true;
        try {
          let response = await this.admin.http({ method: "PUT", url: "/account/updatePassword", data: this.model });
          if (response.status == 200) {
            response = await this.admin.http({ method: "GET", url: "/auth/logout" });
            if (response.status == 200) {
              this.$store.dispatch("auth/logout");
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
\</script\>`;
  },
  watch: {
    tab(value) {
      if (value > 0) {
        Prism.highlightAll(); // highlight code
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
    ...mapActions({
      checkAuth: "auth/checkAuth",
    }),
    async changePassword() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        return false;
      }
      if (await this.checkAuth()) {
        this.loading = true;
        try {
          let response = await this.admin.http({ method: "PUT", url: "/account/updatePassword", data: this.model });
          if (response && response.status == 200) {
            response = await this.admin.http({ method: "GET", url: "/auth/logout" });
            if (response.status == 200) {
              this.$store.dispatch("auth/logout");
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