<template>
  <va-form :id="id" :item="item" v-model="model">
    <v-row no-gutters>
      <v-col lg="3" md="3" sm="8">
        <va-avatar-input
          source="avatar.image"
        >
        </va-avatar-input>

        <va-text-input
          source="firstname"
          :error-messages="firstnameErrors"
        ></va-text-input>

        <va-text-input
          source="lastname"
          :error-messages="lastnameErrors"
        ></va-text-input>

        <va-text-input
          source="email"
          :error-messages="emailErrors"
        ></va-text-input>

        <va-text-input
          source="password"
          :error-messages="passwordErrors"
        ></va-text-input>

        <va-select-input
          source="userRoles"
          reference="roles"
          :error-messages="userRoleErrors"
          multiple
          clearable
        ></va-select-input>

        <va-boolean-input
          source="active"
          hide-details
          class="mb-2"
        ></va-boolean-input>

        <va-boolean-input 
          source="emailActivation"
          class="mb-1"
        >  
        </va-boolean-input>
      </v-col>
    </v-row>
    <va-save-button></va-save-button>
  </va-form>
</template>

<script>
import { provide } from 'vue';
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import Utils from "olobase-admin/src/mixins/utils";

export default {
  props: ["id", "item"],
  mixins: [Utils],
  inheritAttrs: false,
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  validations: {
    model: {
      firstname: {
        required,
        minLength: minLength(2),
      },
      lastname: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(120),
      },
      userRoles: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(16),
      },
    }
  },
  data() {
    return {
      model: {
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        active: 0,
        emailActivation: 0,
        userRoles: null,
        avatar: {
          image: null
        }
      },
    };
  },
  created() {
    this.model.id = this.generateId(this);
    if (!this.id) {
      this.model.password = this.generatePassword(8);
    }
  },
  computed: {
    firstnameErrors() {
      const errors = [];
      if (!this.v$['model'].firstname.$dirty) return errors;
      this.v$['model'].firstname.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$['model'].firstname.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "2" }));
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      if (!this.v$['model'].lastname.$dirty) return errors;
      this.v$['model'].lastname.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$['model'].lastname.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "2" }));
      this.v$['model'].lastname.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "120" }));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.v$['model'].email.$dirty) return errors;
      this.v$['model'].email.required.$invalid &&
        errors.push(this.$t("v.email.required"));
      this.v$["model"].email.email.$invalid && 
        errors.push(this.$t("v.email.invalid"));
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.v$["model"].password.$dirty) return errors;
      this.v$["model"].password.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "8" }));
      this.v$["model"].password.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "16" }));
      return errors;
    },
    userRoleErrors() {
      const errors = [];
      if (!this.v$["model"].userRoles.$dirty) return errors;
      this.v$["model"].userRoles.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
  },
}
</script>