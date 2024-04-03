<template>
  <va-form 
    :id="id" 
    :item="item" 
    v-model="model"
  >
    <v-row no-gutters>
      <v-col sm="3">
        <va-text-input
          source="roleKey"
          :error-messages="roleKeyErrors"
          variant="outlined"
        ></va-text-input>

        <va-text-input
          source="roleName"
          :error-messages="roleNameErrors"
          variant="outlined"
        ></va-text-input>

        <va-text-input
          source="roleLevel"
          :error-messages="roleLevelErrors"
          variant="outlined"
        ></va-text-input>
      </v-col>
    </v-row>
    <h2 class="h2 mb-4">
      {{ $t("menu.permissions") }}
    </h2>
    <v-row>  
      <v-col cols="8">
        <va-check-list-input
          variant="outlined"
          source="rolePermissions"
          group-by="moduleName"
          init-url="/permissions/findAll"
          :headers="headers"
          :fields="fields"
          primary-key="permId"
          items-per-page="25"
          :group-header="$t('resources.roles.fields.moduleName')"
        >
        </va-check-list-input>
      </v-col>
    </v-row>
    <va-save-button></va-save-button>
  </va-form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import { provide } from 'vue'

export default {
  props: ["id", "item"],
  mixins: [utils],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      rolePermissions: [],
      model: {
        id: null,
        roleKey: null,
        roleName: null,
        roleLevel: null,
        rolePermissions: null,
      },
      fields: [
        { source: "moduleName" },
        { source: "action" },
        { source: "route" },
        { source: "method"},
      ],
    };
  },
  validations() {
    return {
      model: {
        roleKey: {
          required,
          maxLength: maxLength(60),
        },
        roleName: {
          required,
          maxLength: maxLength(100),
        },
        roleLevel: {
          required,
          numeric,
          maxLength: maxLength(2),
        },
      },
    }
  },
  computed: {
    headers() {
      return [
        {
          key: "moduleName",
          sortable: false,
        },
        {
          key: "action",
          sortable: false,
        },
        {
          key: "route",
          sortable: false,
        },
        {
          key: "method",
          sortable: false,
        },
      ];
    },
    roleKeyErrors() {
      const errors = [];
      const field = "roleKey";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "60" }));
      return errors;
    },
    roleNameErrors() {
      const errors = [];
      const field = "roleName";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "100" }));
      return errors;
    },
    roleLevelErrors() {
      const errors = [];
      const field = "roleLevel";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].numeric.$invalid &&
        errors.push(this.$t("v.number.numeric"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "2" }));
      return errors;
    },
  },
  created() {
    this.model.id = this.generateId(this);
  }
}
</script>
