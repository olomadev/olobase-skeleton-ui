<template>
  <v-row>
    <v-col sm="12">
      <v-form @submit.prevent="updateAccount">
        <v-card flat>
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <h1 class="h1">{{ $t("resources.account.title") }}</h1>
            </div>
            <v-row>
              <v-col lg="3" md="3" sm="12">
                <va-avatar-input
                  v-model="avatar.image"
                  :set-label="$t('resources.account.fields.avatar.set')"
                  :del-label="$t('resources.account.fields.avatar.delete')"
                >
                </va-avatar-input>

                <va-text-input
                  source="firstname"
                  resource="account"
                  v-model="firstname"
                  variant="outlined"
                  :error-messages="firstnameErrors"
                ></va-text-input>

                <va-text-input
                  source="lastname"
                  resource="account"
                  v-model="lastname"
                  variant="outlined"
                  :error-messages="lastnameErrors"
                />

                <va-text-input
                  source="email"
                  resource="account"
                  v-model="email"
                  type="email"
                  variant="outlined"
                  :error-messages="emailErrors"
                ></va-text-input>

                <va-select-input
                  source="locale"
                  resource="account"
                  v-model="locale"
                  reference="locales"
                  variant="outlined"
                  clearable
                  :error-messages="localeErrors"
                ></va-select-input>

                <va-color-picker-input
                  source="themeColor"
                  resource="account"
                  dot-size="25"
                  mode="hexa"
                  show-swatches
                  swatches-max-height="150"
                  v-model="themeColor"
                  variant="outlined"
                  :error-messages="themeColorErrors"
                ></va-color-picker-input>

              </v-col>
            </v-row>
            <v-btn color="primary" :loading="accountUpdating" type="submit">
              {{ $t("va.actions.save") }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import Trans from "@/i18n/translation";

export default {
  inject: [],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      accountUpdating: false,
      themeColor: null,
      firstname: null,
      lastname: null,
      email: null,
      locale: null,
      avatar: {
        image: null,
      },
    };
  },
  created() {
    this.initializeAccount();
  },
  validations() {
    return {
      firstname: {
        required,
        maxLength: maxLength(120),
      },
      lastname: {
        required,
        maxLength: maxLength(120),
      },
      email: {
        required,
        email,
      },
      locale: {
        required,
      },
      themeColor: {
        required,
        minLength: minLength(7),
        maxLength: maxLength(7),
      },
    }
  },
  computed: {
    firstnameErrors() {
      const errors = [];
      const field = "firstname";
      if (!this.v$[field].$dirty) return errors;
      this.v$[field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$[field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "120" }));
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      const field = "lastname";
      if (!this.v$[field].$dirty) return errors;
      this.v$[field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$[field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "120" }));
      return errors;
    },
    emailErrors() {
      const errors = [];
      const field = "email";
      if (!this.v$[field].$dirty) return errors;
      this.v$[field].required.$invalid &&
        errors.push(this.$t("v.email.required"));
      this.v$[field].email.$invalid && errors.push(this.$t("v.email.invalid"));
      return errors;
    },
    localeErrors() {
      const errors = [];
      const field = "locale";
      this.v$[field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    themeColorErrors() {
      const errors = [];
      const field = "themeColor";
      if (!this.v$[field].$dirty) return errors;
      this.v$[field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$[field].minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "7" }));
      this.v$[field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "7" }));
      return errors;
    },
  },
  methods: {
    async initializeAccount() {
      let response = await this.$admin.http.get("/account/findMe");
      if (response && response.status == 200) {
        let data = response.data.data;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.locale = data.locale;
        this.avatar.image = data.avatar.image;
        this.themeColor = data.themeColor ? data.themeColor : this.$vuetify.theme.themes.defaultTheme.colors.primary;
      }
    },
    async updateAccount() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        return false;
      }
      this.accountUpdating = true;
      try {
        let data = {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          locale: this.locale,
          avatar: {
            image: this.avatar.image,
          },
          themeColor: this.themeColor
        };
        let Self = this;
        let user = await this.$store.getModule("auth").checkAuth();
        if (user) {
          this.$admin.http({ method: "PUT", url: "/account/update", data: data }).then(async function(response){
            if (response && response.status == 200) {
              //
              // switch language
              // 
              if (Self.locale instanceof Object
                && Self.locale["id"]
                && Trans.currentLocale != Self.locale.id
                && Trans.supportedLocales.includes(Self.locale.id)
                ) {
                await Trans.switchLanguage(Self.locale.id);
              }
              Self.$vuetify.theme.themes.defaultTheme.colors.primary = Self.themeColor;
              localStorage.setItem("themeColor", Self.themeColor);
              Self.$router.push({ name: "dashboard"});
              setTimeout(function(){
                Self.$admin.message("success", Self.$t("form.saved"));
              }, 1);
            }
          });
        }
      } catch (e) {
        // console.log(e.message);
      } finally {
        this.accountUpdating = false;
      }
    },
  },
};
</script>
