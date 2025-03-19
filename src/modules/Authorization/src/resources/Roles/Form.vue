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

    <v-tabs
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">{{ $t("authorization.permissions.menu.label") }}</v-tab>
      <v-tab value="2">{{ $t("authorization.users.menu.label") }}</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item eager value="1">
        <v-row class="mt-2">
          <v-col cols="12" sm="12" md="12" lg="6">
            <va-check-list-input
              variant="outlined"
              source="rolePermissions"
              group-by="module"
              init-url="/authorization/permissions/findAll"
              :headers="headers"
              :fields="fields"
              primary-key="permId"
              items-per-page="25"
              :group-header="$t('resources.roles.fields.moduleName')"
            >
            </va-check-list-input>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item eager value="2">
        <v-row class="mt-2">
          <v-col cols="12" sm="12" md="12" lg="6">
            <v-data-table 
              :density="density"
              v-if="tab == 2" 
              :items="model.roleUsers" 
              :headers="userHeaders"
              :search="search"
              :custom-filter="filterText"
            >
              <template v-slot:top>
                <v-text-field 
                  density="compact"
                  variant="outlined" 
                  append-inner-icon="mdi-magnify"
                  v-model="search" 
                  class="mt-2" 
                  color="primary"
                  :label="$t('va.actions.q')"
                  hide-details
                  clearable
                >
                </v-text-field>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <va-save-button></va-save-button>
  </va-form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import { provide } from 'vue'
import config from '@/_config';

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
      search: "",
      tab: null,
      itemsPerPage: 10,
      model: {
        id: null,
        roleKey: null,
        roleName: null,
        roleLevel: null,
        rolePermissions: null,
        roleUsers: [],
      },
      fields: [
        { source: "module" },
        { source: "name" },
        { source: "action" },
        { source: "route" },
        { source: "method"},
      ],
      userHeaders: [
        { text: 'Ad', value: 'firstname' },
        { text: 'Soyad', value: 'lastname' },
        { text: 'E-Posta', value: 'email' },
        { text: 'İşlem', value: 'action', sortable: false }
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
    density() {
      return config.density
    },
    headers() {
      return [
        {
          key: "module",
          sortable: false,
        },
        {
          key: "name",
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
    if (this.item) {
      this.model.roleUsers = this.item.roleUsers;
    }
  },
  methods: {
    filterText(value, search, item) {
      return ( // search in other fields
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleLowerCase().indexOf(search) !== -1
      );
    },
  }

}
</script>
